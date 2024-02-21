import type { Platform } from "@prisma/client";
import type { GithubRepository } from "GQLClient/Types";

export class Transforms {
  public static githubTransform<T extends GithubRepository>(repository: T) {
    return {
      name: repository.name,
      api_url: repository.url,
      platform_id: repository.id,
      html_url: repository.html_url,
      platform: "github" as Platform,
      clone_url: repository.clone_url,
      language: repository.language || undefined,
      description: repository.description || undefined,
    };
  }
}
