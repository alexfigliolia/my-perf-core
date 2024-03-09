import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import type { Role } from "@prisma/client";
import { Errors as GithubErrors, OAuth } from "Github/API";
import { ORM } from "ORM";
import { AsyncController } from "Schema/Resolvers/AsyncJobs/Controller";
import { OrganizationController } from "Schema/Resolvers/Organization/Controller";
import { RoleController } from "Schema/Resolvers/Role/Controller";
import { UserController } from "Schema/Resolvers/User/Controller";
import type { ICreateGithubUser } from "./types";

export class GithubController {
  public static async createAccount(
    { code, installation_id, name }: ICreateGithubUser,
    role: Role,
  ) {
    const org = await OrganizationController.create({
      name,
      installation_id,
      platform: "github",
    });
    const token = await this.generateAccessToken(code);
    void AsyncController.registerRepositoryPull(org, token);
    const { user: githubUser, emails } = await this.getUserAndEmails(token);
    const user = await UserController.findOrCreate(githubUser.name, emails);
    const auth = await this.createGithubUserAuthorization(user.id, token);
    await RoleController.create({
      role,
      userId: user.id,
      organizationId: org.id,
    });
    await OrganizationController.addUserToOrganization(org.id, user.id);
    return auth;
  }

  public static async getCurrentUser(token: string) {
    const emails = await OAuth.getUserEmails(token);
    if (GithubErrors.isAPIEror(emails)) {
      throw this.notFoundError;
    }
    const user = await UserController.findByEmail(emails);
    if (!user) {
      throw this.notFoundError;
    }
    return user;
  }

  private static createGithubUserAuthorization(userId: number, token: string) {
    return ORM.githubUserAuthorization
      .upsert({
        where: { userId },
        create: {
          userId,
          token,
        },
        update: {
          userId,
          token,
        },
      })
      .catch(error => {
        throw Errors.createError(
          "UNEXPECTED_ERROR",
          "Failed to authorized through github",
          error,
        );
      });
  }

  private static async getUserAndEmails(token: string) {
    const { user, emails } = await OAuth.getUser(token);
    if (GithubErrors.isAPIEror(user)) {
      throw Errors.createError(
        "NOT_FOUND",
        "We ran into an error authenticating your account with github. Please try again.",
      );
    }
    if (GithubErrors.isAPIEror(emails)) {
      return { user, emails: [] };
    }
    return { user, emails };
  }

  private static async generateAccessToken(code: string) {
    const token = await OAuth.generateToken(code);
    if (GithubErrors.isAPIEror(token)) {
      throw Errors.createError(
        "UNEXPECTED_ERROR",
        "We ran into an error authenticating your account with github. Please try again.",
      );
    }
    return token.access_token;
  }

  private static get notFoundError() {
    return Errors.createError(
      "NOT_FOUND",
      "You user account could not be found in Github's API. Please ensure you've logged in before and verified your account.",
    );
  }
}
