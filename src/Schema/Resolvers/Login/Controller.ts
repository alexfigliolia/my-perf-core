import { compare } from "bcrypt";
import type { Request } from "express";
import { GraphQLError } from "graphql";
import { DB } from "DB";
import { UserController } from "Schema/Resolvers/User/Controller";
import { Sessions } from "Sessions";
import type { ILogin } from "./types";

export class LoginController {
  public static async login({ email, password }: ILogin) {
    const user = await DB.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new GraphQLError(
        `A user with the email address "${email}" does not exist`,
      );
    }
    if (await compare(password, user.password)) {
      return UserController.userAndAffiliations(user.id);
    }
    throw new GraphQLError("Incorrect password");
  }

  public static async verify({ session }: Request) {
    if (!session || !session.userID || !session.email) {
      throw new GraphQLError("Login");
    }
    const { userID } = session;
    try {
      const result = await UserController.userAndAffiliations(userID);
      if (session.cookie.maxAge || 0 <= 0) {
        session.cookie.maxAge = Sessions.AGE;
      }
      return result;
    } catch (error) {
      throw new GraphQLError("SignUp");
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
