import { GraphQLError } from "graphql";
import { DB } from "DB";
import { Errors } from "Errors";
import { Subscriptions } from "Subscriptions";
import type { IInstallationParams, IOrganizationParams } from "./types";

export class OrganizationController {
  public static async create({
    name,
    installation_id,
    platform,
  }: IOrganizationParams) {
    const Org = await DB.organization.create({
      data: {
        name,
        platform,
        installation_id,
      },
    });
    Subscriptions.publish("newOrganization", installation_id, Org);
    return Org;
  }

  public static async delete(installation_id: number) {
    const org = await DB.organization.delete({
      where: {
        installation_id,
      },
    });
    if (!org) {
      return;
    }
    await DB.user.deleteMany({
      where: {
        organization: {
          every: {
            id: org.id,
          },
        },
      },
    });
  }

  public static async findByID(id: number) {
    const org = await DB.organization.findFirstOrThrow({ where: { id } });
    if (!org) {
      throw new GraphQLError("An organization with this ID does not exist", {
        extensions: Errors.NOT_FOUND,
      });
    }
    return org;
  }

  public static findInstallation({
    platform,
    installation_id,
  }: IInstallationParams) {
    try {
      return DB.organization.findUniqueOrThrow({
        where: {
          platform,
          installation_id,
        },
      });
    } catch (error) {
      throw new GraphQLError(
        `Your ${platform} installation was not found. Please try again in a few minutes`,
        {
          extensions: Errors.NOT_FOUND,
        },
      );
    }
  }

  public static addUserToOrganization(orgID: number, userId: number) {
    return DB.organization.update({
      where: { id: orgID },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
