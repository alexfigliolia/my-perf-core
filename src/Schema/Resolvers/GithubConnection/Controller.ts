import { DB } from "DB";
import { Github } from "Github";
import type { AccessToken } from "Github/types";
import { UserController } from "Schema/Resolvers/User/Controller";
import type { GithubCode } from "./types";

export class GithubController {
  public static async createUser({ code }: GithubCode) {
    const tokens = await Github.OAuth.generateToken(code);
    const user = await Github.OAuth.getUser(tokens.access_token);
    const indexedUser = await UserController.findOrCreate(
      user.name,
      user.email,
    );
    const GH = await this.createGithubUser(indexedUser.id, tokens);
    return {
      ...indexedUser,
      github: GH,
    };
  }

  private static createGithubUser(userId: number, tokens: AccessToken) {
    const { access_token, refresh_token } = tokens;
    return DB.githubUser.upsert({
      where: { userId },
      create: {
        userId,
        token: access_token,
        refresh_token,
      },
      update: {
        userId,
        refresh_token,
        token: access_token,
      },
    });
  }
}
