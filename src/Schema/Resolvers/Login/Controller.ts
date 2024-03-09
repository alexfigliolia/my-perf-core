import type { Request } from "express";
import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import { GithubController } from "Schema/Resolvers/Github/Controller";
import { Sessions } from "Sessions";

export class LoginController {
  public static async loginWithGithub(code: string) {
    return GithubController.getCurrentUser(code);
  }

  public static verify({ session }: Request) {
    if (!session || !session.userID || !session.loggedIn) {
      throw new GraphQLError("/login", {
        extensions: Errors.NOT_FOUND,
      });
    }
    if (session.cookie.maxAge || 0 <= 0) {
      session.cookie.maxAge = Sessions.AGE;
    }
    return true;
  }

  public static verifyAnonymous({ session }: Request) {
    if (!session || !session.loggedIn) {
      return true;
    }
    throw new GraphQLError("/", {
      extensions: Errors.UNEXPECTED_ERROR,
    });
  }

  public static logout({ session }: Request) {
    session.destroy(error => {
      if (error) {
        throw new GraphQLError(error);
      }
    });
  }
}
