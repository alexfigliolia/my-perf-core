import { API } from "./API";
import type { IGithubRepository, RepositoryQuery } from "./types";

export class Repositories extends API {
  public async list(token: string, options: RepositoryQuery) {
    const params = new URLSearchParams({
      page: options.page || "1",
      sort: options.sort || "full_name",
    });
    const repos = await this.wrapRequest<IGithubRepository[]>(
      `https://api.github.com/user/repos?${params.toString()}`,
      token,
    );
    return repos.map(v => ({
      id: v.id,
      name: v.name,
      description: v.description,
      html_url: v.html_url,
      clone_url: v.clone_url,
      language: v.language,
      source: "github",
    }));
  }
}
