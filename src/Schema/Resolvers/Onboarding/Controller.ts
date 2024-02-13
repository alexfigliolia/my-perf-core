import { GithubController } from "Schema/Resolvers/GithubConnection/Controller";
import { OrganizationController } from "Schema/Resolvers/Organization/OrganizationController";
import type { IOnboardWithGithub } from "./types";

export class Controller {
  public static async onboardWithGithub({ code, name }: IOnboardWithGithub) {
    const user = await GithubController.createUser({ code });
    await OrganizationController.create({ name, ownerID: user.id });
    return user;
  }
}
