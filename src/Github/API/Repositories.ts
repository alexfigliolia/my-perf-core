import { API } from "./API";
import { Errors } from "./Errors";
import type {
  IGithubRepository,
  IInstallationRepositoryResponse,
  InstallationRepositoryQuery,
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
      sort: options.sort || "updated",
      per_page: options.per_page || "25",
    });
    const response = await this.wrapGet<IGithubRepository[]>(
      `https://api.github.com/user/repos?${params.toString()}`,
      token,
    );
    if (Errors.isAPIEror(response)) {
      return response;
    }
    return this.transformList(response);
  }

  public static async listInstallationRepositories(
    token: string,
    options: InstallationRepositoryQuery,
  ) {
    const params = new URLSearchParams({
      page: options.page || "1",
      per_page: options.per_page || "25",
    });
    const response = await this.wrapGet<IInstallationRepositoryResponse>(
      `https://api.github.com/installation/repositories?${params.toString()}`,
      token,
    );
    if (Errors.isAPIEror(response)) {
      return response;
    }
    return this.transformList(response.repositories);
  }

  public static async listOrganizationRepositories(
    token: string,
    options: ListOrganizationRepositoryQuery,
  ) {
    const { organization_name } = options;
    const params = new URLSearchParams({
      page: options.page || "1",
      sort: options.sort || "updated",
      per_page: options.per_page || "25",
    });
    const response = await this.wrapGet<IGithubRepository[]>(
      `https://api.github.com/orgs/${organization_name}/repos?${params.toString()}`,
      token,
    );
    if (Errors.isAPIEror(response)) {
      return response;
    }
    return this.transformList(response);
  }

  public static transformList(repos: IGithubRepository[]) {
    return repos.map(v => ({
      id: v.id,
      name: v.name,
      description: v.description,
      html_url: v.html_url,
      clone_url: v.clone_url,
      language: v.language,
      platform: "github",
      api_url: v.url,
    }));
  }
}
