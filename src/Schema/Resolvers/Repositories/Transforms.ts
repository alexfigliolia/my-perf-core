import type { Repository as GithubWebookRepository } from "@octokit/webhooks-types";
import type { Platform } from "@prisma/client";
import type { GithubRepository } from "GQL/PullService";

export class Transforms {
  public static githubTransform<T extends GithubRepository>(repository: T) {
    return {
      name: repository.name,
      api_url: repository.url,
      platform_id: repository.id,
      html_url: repository.html_url,
      platform: "github" as Platform,
      clone_url: repository.clone_url,
      created_at: repository.created_at,
      updated_at: repository.updated_at,
      language: repository.language || undefined,
      description: repository.description || undefined,
    };
  }

  public static githubWebhookTransform<T extends GithubWebookRepository>(
    repository: T,
  ) {
    return {
      name: repository.name,
      api_url: repository.url,
      platform_id: repository.id,
      html_url: repository.html_url,
      platform: "github" as Platform,
      clone_url: repository.clone_url,
      language: repository.language || undefined,
      description: repository.description || undefined,
      created_at: new Date(repository.created_at).toISOString(),
      updated_at: new Date(repository.updated_at).toISOString(),
    };
  }
}
