import { DB } from "DB";
import { EmailController } from "Schema/Resolvers/Emails/Controller";
import type { GenericEmail } from "Schema/Resolvers/Emails/types";

export class UserController {
  public static findByEmail<E extends GenericEmail[]>(emails: E) {
    return DB.user.findFirst({
      where: {
        emails: {
          some: {
            OR: emails.map(v => ({ name: v.email })),
          },
        },
      },
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
    const current = await DB.email.findMany({
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
  }

  public static userScopeQuery(userId: number) {
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
  }
}
