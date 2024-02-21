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
    return ORM.query({
      transaction: DB => {
        return DB.organization.create({
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
        });
      },
      onResult: data => data,
      onError: error => {
        throw new GraphQLError("Failed to create Organization", {
          extensions: Errors.UNEXPECTED_ERROR,
          originalError: error,
        });
      },
    });
  }

  public static async delete(id: number) {
    return ORM.query({
      transaction: DB => {
        return DB.organization.delete({
          where: {
            id,
          },
        });
      },
      onResult: org => {
        return ORM.query({
          transaction: DB => {
            return DB.user.deleteMany({
              where: {
                organizations: {
                  every: {
                    id: org.id,
                  },
                },
              },
            });
          },
          onResult: _ => org,
          onError: _ => {},
        });
      },
      onError: _ => {},
    });
  }

  public static async findByID(id: number) {
    return ORM.query({
      transaction: DB => {
        return DB.organization.findFirst({ where: { id } });
      },
      onResult: data => data,
      onError: error => {
        throw new GraphQLError("An organization with this ID does not exist", {
          extensions: Errors.NOT_FOUND,
          originalError: error,
        });
      },
    });
  }

  public static addUserToOrganization(orgID: number, userId: number) {
    return ORM.query({
      transaction: DB => {
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
      },
      onResult: data => data,
      onError: _ => {},
    });
  }
}
