import { GraphQLError } from "graphql";
import { DB } from "DB";
import { Errors } from "Errors";
import { Github } from "Github";
import { UserController } from "Schema/Resolvers/User/Controller";
import type { GithubCode, ISearchRepositories } from "./types";

export class GithubController {
  public static async createUser({ code }: GithubCode) {
    const token = await this.generateAccessToken(code);
    const { user, emails } = await this.getUserAndEmails(token);
    const indexedUser = await UserController.findOrCreate(user.name, emails);
    const GH = await this.createGithubUser(indexedUser.id, token);
    return {
      ...indexedUser,
      github: GH,
    };
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

  public static async listUserRepositores({
    userId,
    page,
    sort,
  }: ISearchRepositories) {
    const tokens = await DB.githubUser.findFirst({ where: { userId } });
    if (!tokens) {
      throw new GraphQLError("Unauthorized", {
        extensions: Errors.UNAUTHORIZED,
      });
    }
    return Github.Repositories.list(tokens.token, { sort, page });
  }

  private static createGithubUser(userId: number, token: string) {
    return DB.githubUser.upsert({
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
