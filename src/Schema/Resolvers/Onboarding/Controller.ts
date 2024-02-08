import { compare, hash } from "bcrypt";
import { GraphQLError } from "graphql";
import { type Organization, type User, UserRole } from "@prisma/client";
import { DB } from "DB";
import { Errors } from "Errors";
import { SmartPunctuation } from "Sanitizers";
import { UserController } from "Schema/Resolvers/User/Controller";
import type { IOnBoard } from "./types";

export class OnboardController {
  public static readonly SALTS = 10;
  public static readonly sanitizeKeys = new Set<keyof IOnBoard>([
    "email",
    "username",
    "password",
    "organizationName",
  ]);

  public static async onboard(params: IOnBoard) {
    const data = SmartPunctuation.sanitizeKeys(params, this.sanitizeKeys);
    const { organizationName } = data;
    const user = await this.findOrCreateUser(data);
    if (await this.findConflictingOrgs(organizationName, user.id)) {
      throw new GraphQLError(
        `You are already affiliated with an organization named "${organizationName}"`,
        {
          extensions: Errors.BAD_REQUEST,
        },
      );
    }
    const org = await this.createOrganization(data, user);
    await this.createOwnership(user, org);
    return user;
  }

  private static async findOrCreateUser({
    username,
    email,
    password,
  }: IOnBoard) {
    const user = await UserController.findByEmail(email);
    if (user) {
      if (!(await compare(password, user.password))) {
        throw new GraphQLError("Your password is incorrect", {
          extensions: Errors.BAD_REQUEST,
        });
      }
      return user;
    }
    return DB.user.create({
      data: {
        email,
        name: username,
        password: await hash(password, this.SALTS),
      },
    });
  }

  private static createOrganization(
    { organizationName }: IOnBoard,
    user: User,
  ) {
    return DB.organization.create({
      data: {
        name: organizationName,
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  private static async createOwnership(user: User, org: Organization) {
    return Promise.all([
      DB.owner.create({
        data: {
          userId: user.id,
          organizationId: org.id,
        },
      }),
      DB.role.create({
        data: {
          userId: user.id,
          type: UserRole.admin,
          organizationId: org.id,
        },
      }),
    ]);
  }

  private static async findConflictingOrgs(name: string, userID: number) {
    return DB.organization.findFirst({
      where: {
        name,
        users: {
          some: {
            id: userID,
          },
        },
      },
    });
  }
}
