import { GraphQLError } from "graphql";
import { Errors } from "Errors";
import { ORM } from "ORM";
import { EmailController } from "Schema/Resolvers/Emails/Controller";
import type { GenericEmail } from "Schema/Resolvers/Emails/types";

export class UserController {
  public static async findByEmail<E extends GenericEmail[]>(emails: E) {
    return ORM.query({
      transaction: DB => {
        return DB.user.findFirst({
          where: {
            emails: {
              some: {
                OR: emails.map(v => ({ name: v.email })),
              },
            },
          },
        });
      },
      onResult: data => data,
      onError: _ => {},
    });
  }

  public static async findOrCreate<E extends GenericEmail[]>(
    name: string,
    emails: E,
  ) {
    const user = await this.findByEmail(emails);
    if (user) {
      await this.assignEmailsToUser(user.id, emails);
      return user;
    }
    return this.createUserWithEmails(name, emails);
  }

  private static async assignEmailsToUser<E extends GenericEmail[]>(
    userId: number,
    emails: E,
  ) {
    const current = await ORM.query({
      transaction: DB => {
        return DB.email.findMany({
          where: { userId },
          select: { name: true },
        });
      },
      onResult: data => data,
      onError: _ => [],
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
    return ORM.query({
      transaction: DB => {
        return DB.user.create({
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
        });
      },
      onResult: data => data,
      onError: _ => {
        throw new GraphQLError("Failed to created user", {
          extensions: Errors.UNEXPECTED_ERROR,
        });
      },
    });
  }

  public static userScopeQuery(userId: number) {
    return ORM.query({
      transaction: DB => {
        return DB.user.findUnique({
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
        });
      },
      onResult: data => data,
      onError: error => {
        throw new GraphQLError("User Affiliation not found", {
          extensions: Errors.NOT_FOUND,
          originalError: error,
        });
      },
    });
  }
}
