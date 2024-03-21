import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import { ORM } from "ORM";
import type { EmailMapTuple, IOrganizationParams } from "./types";

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
    const org = await ORM.query(
      ORM.organization.delete({
        where: {
          id,
        },
      }),
    );
    if (org) {
      await ORM.user.deleteMany({
        where: {
          organizations: {
            every: {
              id: org.id,
            },
          },
        },
      });
    }
    return org;
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

  public static async userEmailList(id: number): Promise<EmailMapTuple> {
    const results = await ORM.query(
      ORM.organization.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              id: true,
              emails: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    );
    if (!results) {
      throw Errors.createError("NOT_FOUND", "This organization was not found");
    }
    const emailList = new Set<string>();
    const userMap = new Map<string, number>();
    for (const user of results.users) {
      const { id, emails } = user;
      for (const { name } of emails) {
        emailList.add(name);
        userMap.set(name, id);
      }
    }
    return [emailList, userMap];
  }
}
