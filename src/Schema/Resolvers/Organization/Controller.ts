import { GraphQLError } from "graphql";
import { Errors } from "Errors";
import { ORM } from "ORM";
import type { IOrganizationParams } from "./types";

export class OrganizationController {
  public static async create({
    name,
    installation_id,
    platform,
  }: IOrganizationParams) {
    return ORM.organization
      .create({
        data: {
          name,
          installations: {
            connect: {
              platform,
              installation_id,
            },
          },
        },
        include: {
          installations: {
            select: {
              id: true,
              token: true,
              platform: true,
              type: true,
            },
          },
        },
      })
      .catch(error => {
        throw new GraphQLError("Failed to create Organization", {
          extensions: Errors.UNEXPECTED_ERROR,
          originalError: error,
        });
      });
  }

  public static async delete(id: number) {
    const org = await ORM.organization.delete({
      where: {
        id,
      },
    });
    return ORM.user.deleteMany({
      where: {
        organizations: {
          every: {
            id: org.id,
          },
        },
      },
    });
  }

  public static async findByID(id: number) {
    return ORM.organization.findFirstOrThrow({ where: { id } }).catch(error => {
      throw new GraphQLError("An organization with this ID does not exist", {
        extensions: Errors.NOT_FOUND,
        originalError: error,
      });
    });
  }

  public static addUserToOrganization(orgID: number, userId: number) {
    return ORM.organization.update({
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

  public static allUsers(id: number) {
    return ORM.organization.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            emails: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
