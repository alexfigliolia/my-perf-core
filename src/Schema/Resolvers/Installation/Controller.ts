import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import type { Platform } from "@prisma/client";
import { Errors as GithubError, InstallationTokens } from "Github/API";
import { Logger } from "Logger";
import { ORM } from "ORM";
import { OrganizationController } from "Schema/Resolvers/Organization/Controller";
import { Subscriptions } from "Subscriptions";
import type { ICreateInstallation, IToken } from "./types";

export class InstallationController {
  public static async create({
    type,
    platform,
    installation_id,
  }: ICreateInstallation) {
    try {
      const { token, expiration } =
        await this.generateGithubInstallationToken(installation_id);
      const install = await ORM.installation.create({
        data: {
          type,
          token,
          platform,
          expiration,
          installation_id,
        },
      });
      Subscriptions.publish(
        "newInstallation",
        this.broadcastKey(installation_id, platform),
        install,
      );
      return install;
    } catch (error: any) {
      throw new GraphQLError("Failed to create installation", {
        extensions: Errors.UNEXPECTED_ERROR,
        originalError: error,
      });
    }
  }

  public static async delete(installation_id: number) {
    try {
      const install = await ORM.installation.delete({
        where: {
          installation_id,
        },
        select: {
          id: true,
          organization: {
            select: {
              id: true,
              installations: {
                where: {
                  NOT: {
                    installation_id: {
                      equals: installation_id,
                    },
                  },
                },
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      if (install.organization) {
        const installs = install.organization?.installations || [];
        if (!installs.length) {
          await OrganizationController.delete(install.organization.id);
        }
        return install;
      }
    } catch (error) {
      Logger.ORM("Failed to delete installation", error);
    }
  }

  public static find(installation_id: number, platform: Platform) {
    return ORM.installation
      .findFirstOrThrow({
        where: { AND: [{ installation_id }, { platform }] },
      })
      .catch(error => {
        throw new GraphQLError("Installation not found", {
          extensions: Errors.NOT_FOUND,
          originalError: error,
        });
      });
  }

  public static async emitLast(installation_id: number, platform: Platform) {
    try {
      const install = await InstallationController.find(
        installation_id,
        platform,
      );
      Subscriptions.publish(
        "newInstallation",
        this.broadcastKey(installation_id, platform),
        install,
      );
    } catch (error) {
      // silence
    }
  }

  public static broadcastKey(installation_id: number, platform: string) {
    return `${installation_id}-${platform}`;
  }

  public static async generateGithubInstallationToken(installation_id: number) {
    const token = await InstallationTokens.create(installation_id);
    if (GithubError.isAPIEror(token)) {
      throw new GraphQLError(token.message, {
        extensions: Errors.UNEXPECTED_ERROR,
      });
    }
    return {
      token: token.token,
      expiration: token.expires_at,
    };
  }

  public static async currentToken(id: number) {
    const current = await this.getToken(id);
    const nextToken = await InstallationTokens.validateToken({
      ...current,
      installation_id: id,
    });
    if (GithubError.isAPIEror(nextToken)) {
      throw new GraphQLError(nextToken.message, {
        extensions: Errors.UNEXPECTED_ERROR,
        originalError: new Error("Unexpected Error", { cause: nextToken }),
      });
    }
    const { token, expires_at } = nextToken;
    if (
      expires_at !== current.expiration ||
      nextToken.token !== current.token
    ) {
      void this.setToken(id, { token, expiration: expires_at });
    }
    return token;
  }

  private static getToken(id: number) {
    return ORM.installation
      .findUniqueOrThrow({
        where: { id },
        select: {
          token: true,
          expiration: true,
        },
      })
      .catch(error => {
        throw new GraphQLError("Unauthorized", {
          extensions: Errors.UNAUTHORIZED,
          originalError: error,
        });
      });
  }

  public static setToken(id: number, token: IToken) {
    return ORM.query(
      ORM.installation.update({
        where: { id },
        data: {
          ...token,
        },
      }),
    );
  }

  public static async getOrganization(
    installation_id: number,
    platform: Platform,
  ) {
    const install = await ORM.installation.findFirstOrThrow({
      where: { AND: [{ installation_id }, { platform }] },
      select: {
        organization: true,
      },
    });
    return install.organization;
  }
}
