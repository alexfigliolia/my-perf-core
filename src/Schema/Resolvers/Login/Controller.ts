import { compare } from "bcrypt";
import type { Request } from "express";
import { GraphQLError } from "graphql";
import { Errors } from "Errors";
import { SmartPunctuation } from "Sanitizers";
import { UserController } from "Schema/Resolvers/User/Controller";
import { Sessions } from "Sessions";
import type { ILogin } from "./types";

export class LoginController {
  public static readonly sanitizeKeys = new Set<keyof ILogin>([
    "email",
    "password",
  ]);

  public static async login(params: ILogin) {
    const { email, password } = SmartPunctuation.sanitizeKeys(
      params,
      this.sanitizeKeys,
    );
    const user = await UserController.findByEmail(email);
    if (!user) {
      throw new GraphQLError("This account does not exist yet", {
        extensions: Errors.NOT_FOUND,
      });
    }
    if (await compare(password, user.password)) {
      return user;
    }
    throw new GraphQLError("Incorrect password", {
      extensions: Errors.BAD_REQUEST,
    });
  }

  public static async verify({ session }: Request) {
    if (!session || !session.userID || !session.email) {
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
