import { GraphQLError } from "graphql";
import type { Role } from "@prisma/client";
import { DB } from "DB";
import { Errors } from "Errors";
import { Github } from "Github";
import type { GenericEmail } from "Schema/Resolvers/Emails";
import { OrganizationController } from "Schema/Resolvers/Organization";
import { RoleController } from "Schema/Resolvers/Role";
import { UserController } from "Schema/Resolvers/User";
import type { ICreateGithubUser, ISearchRepositories } from "./types";

export class GithubController {
  public static async createUser(
    { code, orgID }: ICreateGithubUser,
    role: Role,
  ) {
    const org = await OrganizationController.findByID(orgID);
    const token = await this.generateAccessToken(code);
    const { user: githubUser, emails } = await this.getUserAndEmails(token);
    const user = await UserController.findOrCreate(githubUser.name, emails);
    const auth = await this.createGithubAuthorization(user.id, token);
    await RoleController.create({
      role,
      userId: user.id,
      organizationId: org.id,
    });
    await OrganizationController.addUserToOrganization(org.id, user.id);
    return auth;
  }

  public static async getCurrentUser(token: string) {
    const emails = await Github.OAuth.getUserEmails(token);
    if (Github.Errors.isAPIEror(emails)) {
      throw this.notFoundError;
    }
    const user = await UserController.findByEmail(emails);
    if (!user) {
      throw this.notFoundError;
    }
    return user;
  }

  public static selectGithubUser<E extends GenericEmail[]>(emails: E) {
    return DB.user.findFirst({
      where: {
        emails: {
          some: {
            OR: emails.map(v => ({ name: v.email })),
          },
        },
      },
      select: {
        id: true,
        name: true,
        github: true,
      },
    });
  }

  public static async listUserRepositores({
    userId,
    page,
    sort,
  }: ISearchRepositories) {
    const tokens = await DB.githubAuthorization.findFirst({
      where: { userId },
    });
    if (!tokens) {
      throw new GraphQLError("Unauthorized", {
        extensions: Errors.UNAUTHORIZED,
      });
    }
    return Github.Repositories.list(tokens.token, { sort, page });
  }

  private static createGithubAuthorization(userId: number, token: string) {
    return DB.githubAuthorization.upsert({
      where: { userId },
      create: {
        userId,
        token,
      },
      update: {
        userId,
        token,
      },
    });
  }

  private static async getUserAndEmails(token: string) {
    const { user, emails } = await Github.OAuth.getUser(token);
    if (Github.Errors.isAPIEror(user)) {
      throw new GraphQLError(
        "We ran into an error authenticating your account with github. Please try again.",
        {
          extensions: Errors.NOT_FOUND,
        },
      );
    }
    if (Github.Errors.isAPIEror(emails)) {
      return { user, emails: [] };
    }
    return { user, emails };
  }

  private static async generateAccessToken(code: string) {
    const token = await Github.OAuth.generateToken(code);
    if (Github.Errors.isAPIEror(token)) {
      throw new GraphQLError(
        "We ran into an error authenticating your account with github. Please try again.",
        {
          extensions: Errors.UNEXPECTED_ERROR,
        },
      );
    }
    return token.access_token;
  }

  private static get notFoundError() {
    return new GraphQLError(
      "You user account could not be found in Github's API. Please ensure you've logged in before and verified your account.",
      {
        extensions: Errors.NOT_FOUND,
      },
    );
  }
}
