import type { Repository as WebHookRepository } from "@octokit/webhooks-types";
import { ORM } from "ORM";
import { Transforms } from "./Transforms";
import type { InputRepository } from "./types";

export class RepositoryController {
  public static async createMany(repositories: InputRepository[]) {
    return ORM.query(
      ORM.repository.createMany({
        data: repositories.map(repo => ({
          ...repo,
          language: repo.language || "",
          description: repo.description || "",
        })),
      }),
    );
  }

  public static createFromWebhook(
    repo: WebHookRepository,
    organizationId: number,
  ) {
    return ORM.query(
      ORM.repository.create({
        data: {
          organizationId,
          ...Transforms.githubTransform(repo),
        },
      }),
    );
  }

  public static deleteGithubRepository(id: number) {
    return ORM.query(
      ORM.repository.deleteMany({
        where: {
          AND: [{ platform: "github" }, { platform_id: id }],
        },
      }),
    );
  }

  public static updateFromWebhook(repo: WebHookRepository) {
    return ORM.query(
      ORM.repository.updateMany({
        where: {
          AND: [{ platform: "github" }, { platform_id: repo.id }],
        },
        data: Transforms.githubTransform(repo),
      }),
    );
  }
}
