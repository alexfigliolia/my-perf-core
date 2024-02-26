import type { Repository as WebHookRepository } from "@octokit/webhooks-types";
import type { Platform } from "@prisma/client";

export class Transforms {
  public static githubTransform(repository: WebHookRepository) {
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
