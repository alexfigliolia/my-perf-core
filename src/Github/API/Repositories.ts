import { API } from "./API";
import { Errors } from "./Errors";
import type {
  IGithubRepository,
  IInstallationRepositoryResponse,
  ListOrganizationRepositoryQuery,
  ListRepositoryQuery,
} from "./types";

export class Repositories extends API {
  public static async listUserRepositories(
    token: string,
    options: ListRepositoryQuery,
  ) {
    const params = new URLSearchParams({
      page: options.page || "1",
      sort: options.sort || "full_name",
    });
    const repos = await this.wrapGet<IGithubRepository[]>(
      `https://api.github.com/user/repos?${params.toString()}`,
      token,
    );
    if (Array.isArray(repos)) {
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
    return repos;
  }

  public static async listInstallationRepositories(
    token: string,
    page?: string | null,
  ) {
    const params = new URLSearchParams({
      page: page || "1",
      per_page: "25",
    });
    const response = await this.wrapGet<IInstallationRepositoryResponse>(
      `https://api.github.com/installation/repositories?${params.toString()}`,
      token,
    );
    if (Errors.isAPIEror(response)) {
      return response;
    }
    if (Array.isArray(response.repositories)) {
      return response.repositories.map(v => ({
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

  public static async listOrganizationRepositories(
    token: string,
    options: ListOrganizationRepositoryQuery,
  ) {
    const { organization_name } = options;
    const params = new URLSearchParams({
      page: options.page || "1",
      sort: options.sort || "full_name",
    });
    const repos = await this.wrapGet<IGithubRepository[]>(
      `https://api.github.com/orgs/${organization_name}/repos?${params.toString()}`,
      token,
    );
    if (Array.isArray(repos)) {
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
    return repos;
  }
}
