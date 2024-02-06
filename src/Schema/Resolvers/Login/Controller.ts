import { compare } from "bcrypt";
import { GraphQLError } from "graphql";
import { DB } from "DB";
import type { ILogin } from "./types";

export class Controller {
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
      return user;
    }
    throw new GraphQLError("Incorrect password");
  }
}
