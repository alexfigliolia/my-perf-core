import { GraphQLError } from "graphql";
import { Errors } from "Errors";
import { ORM } from "ORM";
import { EmailController } from "Schema/Resolvers/Emails/Controller";
import type { GenericEmail } from "Schema/Resolvers/Emails/types";

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
}
