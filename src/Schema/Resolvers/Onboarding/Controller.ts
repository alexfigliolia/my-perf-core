import { compare, hash } from "bcrypt";
import { GraphQLError } from "graphql";
import { type Organization, type User, UserRole } from "@prisma/client";
import { DB } from "DB";
import { UserController } from "Schema/Resolvers/User/Controller";
import type { IOnBoard } from "./types";

export class OnboardController {
  public static readonly SALTS = 10;

  public static async onboard(params: IOnBoard) {
    const user = await this.findOrCreateUser(params);
    if (await this.findOrgConflict(params.organizationName)) {
      throw new GraphQLError(
        `You are already affiliated with an organization with the name "${params.organizationName}"`,
      );
    }
    const org = await this.createOrganization(params, user);
    await this.createOwnership(user, org);
    return UserController.userAndAffiliations(user.id);
  }

  private static async findOrCreateUser({
    username,
    email,
    password,
  }: IOnBoard) {
    const user = await DB.user.findFirst({
      where: { email },
    });
    if (user) {
      if (!(await compare(password, user.password))) {
        throw new GraphQLError("Your password is incorrect");
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
    { platform, organizationName }: IOnBoard,
    user: User,
  ) {
    return DB.organization.create({
      data: {
        platform,
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

  private static findOrgConflict(name: string) {
    return DB.organization.findFirst({ where: { name } });
  }
}
