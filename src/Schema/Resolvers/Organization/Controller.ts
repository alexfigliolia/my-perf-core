import { GraphQLError } from "graphql";
import { DB } from "DB";
import { Errors } from "Errors";
import type { IOrganizationParams } from "./types";

export class OrganizationController {
  public static async create({
    name,
    installation_id,
    platform,
  }: IOrganizationParams) {
    const Org = await DB.organization.create({
      data: {
        name,
        installations: {
          connectOrCreate: {
            where: {
              platform,
              installation_id,
            },
            create: {
              platform,
              installation_id,
            },
          },
        },
      },
    });
    return Org;
  }

  public static async delete(id: number) {
    const org = await DB.organization.delete({
      where: {
        id,
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