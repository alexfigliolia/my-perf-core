import type { Request } from "express";
import { GraphQLError } from "graphql";
import { Errors } from "Errors";
import { GithubController } from "Schema/Resolvers/Github/Controller";
import { UserController } from "Schema/Resolvers/User/Controller";
import { Sessions } from "Sessions";

export class LoginController {
  public static async loginWithGithub(code: string) {
    return GithubController.getCurrentUser(code);
  }

  public static async verify({ session }: Request) {
    if (!session || !session.userID) {
      throw new GraphQLError("/login", {
        extensions: Errors.NOT_FOUND,
      });
    }
    try {
      const result = await UserController.userAndAffiliations(session.userID);
      if (session.cookie.maxAge || 0 <= 0) {
        session.cookie.maxAge = Sessions.AGE;
      }
      return result;
    } catch (error) {
      throw new GraphQLError("/login/sign-up", {
        extensions: Errors.NOT_FOUND,
      });
    }
  }

  public static logout({ session }: Request) {
    session.destroy(error => {
      if (error) {
        throw new GraphQLError(error);
      }
    });
  }
}
