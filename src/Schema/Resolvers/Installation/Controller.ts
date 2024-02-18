import { GraphQLError } from "graphql";
import type { Platform } from "@prisma/client";
import { Errors } from "Errors";
import { Errors as GithubError, InstallationTokens } from "Github/API";
import { ORM } from "ORM";
import { OrganizationController } from "Schema/Resolvers/Organization/Controller";
import { Subscriptions } from "Subscriptions";
import type { ICreateInstallation, TokenList } from "./types";

export class InstallationController {
  public static async create({
    platform,
    installation_id,
  }: ICreateInstallation) {
    const { token, expiration } =
      await this.generateGithubToken(installation_id);
    return ORM.query({
      transaction: DB => {
        return DB.installation.create({
          data: {
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

  public static async generateGithubToken(installation_id: number) {
    const token = await InstallationTokens.create(installation_id);
    if (GithubError.isAPIEror(token)) {
      throw new GraphQLError("Failed to authorize github installation", {
        extensions: Errors.UNEXPECTED_ERROR,
      });
    }
    return {
      token: token.token,
      expiration: token.expires_at,
    };
  }

  public static parseTokens<T extends TokenList>(tokens: T) {
    let github: string | null = null;
    let bitbucket: string | null = null;
    for (const { token, platform } of tokens) {
      if (platform === "github") {
        github = token;
      } else if (platform === "bitbucket") {
        bitbucket = token;
      }
    }
    return { github, bitbucket };
  }
}
