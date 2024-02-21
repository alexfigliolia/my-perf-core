import { GraphQLError } from "graphql";
import type { Platform } from "@prisma/client";
import { Errors } from "Errors";
import { Errors as GithubError, InstallationTokens } from "Github/API";
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
    const { token, expiration } =
      await this.generateGithubInstallationToken(installation_id);
    return ORM.query({
      transaction: DB => {
        return DB.installation.create({
          data: {
            type,
            token,
            platform,
            expiration,
            installation_id,
          },
        });
      },
      onResult: installation => {
        Subscriptions.publish(
          "newInstallation",
          this.broadcastKey(installation_id, platform),
          installation,
        );
        return installation;
      },
      onError: error => {
        throw new GraphQLError("Failed to create installation", {
          extensions: Errors.UNEXPECTED_ERROR,
          originalError: error,
        });
      },
    });
  }

  public static async delete(installation_id: number) {
    return ORM.query({
      transaction: DB => {
        return DB.installation.delete({
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
      },
      onResult: async installation => {
        if (installation.organization) {
          const installs = installation.organization?.installations || [];
          if (!installs.length) {
            await OrganizationController.delete(installation.organization.id);
          }
          return installation;
        }
      },
      onError: _ => {},
    });
  }

  public static find(installation_id: number, platform: Platform) {
    return ORM.query({
      transaction: DB => {
        return DB.installation.findFirst({
          where: { AND: [{ installation_id }, { platform }] },
        });
      },
      onResult: installation => installation,
      onError: error => {
        throw new GraphQLError("Installation not found", {
          extensions: Errors.NOT_FOUND,
          originalError: error,
        });
      },
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
    return ORM.query({
      transaction: DB => {
        return DB.installation.findUnique({
          where: { id },
          select: {
            token: true,
            expiration: true,
          },
        });
      },
      onResult: data => data,
      onError: error => {
        throw new GraphQLError("Unauthorized", {
          extensions: Errors.UNAUTHORIZED,
          originalError: error,
        });
      },
    });
  }

  public static setToken(id: number, token: IToken) {
    return ORM.query({
      transaction: DB => {
        return DB.installation.update({
          where: { id },
          data: {
            ...token,
          },
        });
      },
      onResult: data => data,
      onError: () => {},
    });
  }

  public static getOrganization(installation_id: number, platform: Platform) {
    return ORM.query({
      transaction: DB => {
        return DB.installation.findFirst({
          where: { AND: [{ installation_id }, { platform }] },
          select: {
            organization: true,
          },
        });
      },
      onResult: installation => {
        return installation.organization;
      },
      onError: () => {},
    });
  }
}
