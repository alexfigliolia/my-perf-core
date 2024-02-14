import { GraphQLError } from "graphql";
import { DB } from "DB";
import { Errors } from "Errors";
import type { Email } from "./types";

export class UserController {
  public static findByEmail<E extends Email[]>(emails: E) {
    return DB.user.findFirst({
      where: {
        emails: {
          some: {
            OR: emails.map(v => ({ email: v.email })),
          },
        },
      },
    });
  }

  public static async findOrCreate<E extends Email[]>(name: string, emails: E) {
    const user = await this.findByEmail(emails);
    if (user) {
      return user;
    }
    return DB.user.create({
      data: {
        name,
        emails: {
          create: emails.map(v => ({
            email: v.email,
            primary: v.primary || false,
            verified: v.verified || false,
          })),
        },
      },
    });
  }

  public static async userAndAffiliations(userID: number) {
    const { organizations, ...user } = await this.userScopeQuery(userID);
    return {
      user,
      organizations: organizations.map(org => {
        const { roles, ...rest } = org;
        return {
          ...rest,
          role: roles[0].type,
        };
      }),
    };
  }

  public static userScopeQuery(userID: number) {
    return DB.user.findUniqueOrThrow({
      where: { id: userID },
      select: {
        id: true,
        name: true,
        github: {
          select: {
            id: true,
            token: true,
          },
        },
        organizations: {
          select: {
            id: true,
            name: true,
            roles: {
              where: {
                userId: userID,
              },
              select: {
                type: true,
              },
              take: 1,
            },
          },
        },
      },
    });
  }
}
