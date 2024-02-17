import type { Platform } from "@prisma/client";
import { DB } from "DB";
import { OrganizationController } from "Schema/Resolvers/Organization/Controller";
import { Subscriptions } from "Subscriptions";
import type { ICreateInstallation } from "./types";

export class InstallationController {
  public static async create({
    platform,
    installation_id,
  }: ICreateInstallation) {
    const installation = await DB.installation.create({
      data: {
        platform,
        installation_id,
      },
    });
    Subscriptions.publish(
      "newInstallation",
      this.broadcastKey(installation_id, platform),
      installation,
    );
    return installation;
  }

  public static async delete(installation_id: number) {
    const installation = await DB.installation.delete({
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
    if (!installation || !installation.organization) {
      return installation;
    }
    const installs = installation.organization?.installations || [];
    if (!installs.length) {
      await OrganizationController.delete(installation.organization.id);
    }
    return installation;
  }

  public static find(installation_id: number, platform: Platform) {
    return DB.installation.findFirst({
      where: { AND: [{ installation_id }, { platform }] },
    });
  }

  public static broadcastKey(installation_id: number, platform: string) {
    return `${installation_id}-${platform}`;
  }
}
