import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import { ORM } from "ORM";
import { EmailController } from "Schema/Resolvers/Emails/Controller";
import type { GenericEmail } from "Schema/Resolvers/Emails/types";
import { RoleController } from "Schema/Resolvers/Role/Controller";
import type { IAddNewUserToTeam } from "./types";

export class UserController {
  public static async findByEmail<E extends GenericEmail[]>(emails: E) {
    return ORM.query(
      ORM.user.findFirst({
        where: {
          emails: {
            some: {
              OR: emails.map(v => ({ name: v.email })),
            },
          },
        },
      }),
    );
  }

  public static async findOrCreate<E extends GenericEmail[]>(
    name: string,
    emails: E,
  ) {
    try {
      const user = await this.findByEmail(emails);
      if (user) {
        await this.assignEmailsToUser(user.id, emails);
        return user;
      }
      return this.createUserWithEmails(name, emails);
    } catch (error: any) {
      throw new GraphQLError("Failed create or find user", {
        extensions: Errors.UNEXPECTED_ERROR,
        originalError: error,
      });
    }
  }

  private static async assignEmailsToUser<E extends GenericEmail[]>(
    userId: number,
    emails: E,
  ) {
    const current = await ORM.email.findMany({
      where: { userId },
      select: { name: true },
    });
    const set = new Set(current.map(v => v.name));
    const transactions: Promise<any>[] = [];
    for (const email of emails) {
      if (!set.has(email.email)) {
        transactions.push(EmailController.create(userId, email));
      }
    }
    return Promise.all(transactions);
  }

  private static createUserWithEmails<E extends GenericEmail[]>(
    name: string,
    emails: E,
  ) {
    return ORM.user
      .create({
        data: {
          name,
          emails: {
            create: emails.map(v => ({
              name: v.email,
              primary: v.primary || false,
              verified: v.verified || false,
            })),
          },
        },
      })
      .catch(error => {
        throw new GraphQLError("Failed to created user", {
          extensions: Errors.UNEXPECTED_ERROR,
          originalError: error,
        });
      });
  }

  public static async addNewUserToTeam(args: IAddNewUserToTeam) {
    const user = await ORM.query(
      ORM.user.findFirst({
        where: {
          emails: {
            some: {
              name: args.email,
            },
          },
        },
      }),
    );
    if (user) {
      return RoleController.addRolesToUser(user.id, args);
    }
    return this.createUserWithRoles(args);
  }

  public static createUserWithRoles({
    name,
    role,
    email,
    teamId,
    organizationId,
  }: IAddNewUserToTeam) {
    return ORM.query(
      ORM.user.create({
        data: {
          name,
          emails: {
            connectOrCreate: {
              create: {
                name: email,
              },
              where: {
                name: email,
              },
            },
          },
          teams: {
            connect: {
              id: teamId,
            },
          },
          organizations: {
            connect: {
              id: organizationId,
            },
          },
          roles: {
            create: {
              role,
              organizationId,
            },
          },
          teamRoles: {
            create: {
              role,
              teamId,
              organizationId,
            },
          },
        },
      }),
      error => {
        throw Errors.createError(
          "UNEXPECTED_ERROR",
          "Something went wrong. Please try again.",
          error,
        );
      },
    );
  }

  public static async userScopeQuery(userId: number) {
    return ORM.query(
      ORM.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          github: {
            select: {
              token: true,
            },
          },
          organizations: {
            select: {
              id: true,
              name: true,
              installations: {
                select: {
                  id: true,
                  type: true,
                  platform: true,
                },
              },
              roles: {
                where: {
                  userId,
                },
                select: {
                  role: true,
                },
              },
            },
          },
        },
      }),
      error => {
        throw new GraphQLError("User Affiliation not found", {
          extensions: Errors.NOT_FOUND,
          originalError: error,
        });
      },
    );
  }

  public static async getUser(id: number) {
    const user = await ORM.query(ORM.user.findUnique({ where: { id } }));
    if (!user) {
      throw Errors.createError(
        "NOT_FOUND",
        "This user was not found. Please try again",
      );
    }
    return user;
  }
}
