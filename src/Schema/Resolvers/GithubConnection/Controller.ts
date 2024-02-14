import { GraphQLError } from "graphql";
import { DB } from "DB";
import { Github } from "Github";
import { UserController } from "Schema/Resolvers/User/Controller";
import type { GithubCode, ISearchRepositories } from "./types";

export class GithubController {
  public static async createUser({ code }: GithubCode) {
    const { access_token } = await Github.OAuth.generateToken(code);
    const user = await Github.OAuth.getUser(access_token);
    const indexedUser = await UserController.findOrCreate(
      user.name,
      user.email,
    );
    const GH = await this.createGithubUser(indexedUser.id, access_token);
    return {
      ...indexedUser,
      github: GH,
    };
  }

  public static async listUserRepositores({
    userId,
    page,
    sort,
  }: ISearchRepositories) {
    const tokens = await DB.githubUser.findFirst({ where: { userId } });
    if (!tokens) {
      throw new GraphQLError("Unauthorized");
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
}
