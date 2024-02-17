import { GraphQLError } from "graphql";
import type { Platform } from "@prisma/client";
import { Errors } from "Errors";
import { ORM } from "ORM";
import { OrganizationController } from "Schema/Resolvers/Organization/Controller";
import { Subscriptions } from "Subscriptions";
import type { ICreateInstallation } from "./types";

export class InstallationController {
  public static async create({
    platform,
    installation_id,
  }: ICreateInstallation) {
    return ORM.query({
      transaction: DB => {
        return DB.installation.create({
          data: {
            platform,
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
}
