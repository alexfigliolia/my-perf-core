import type { Repository } from "@octokit/webhooks-types";
import { API } from "./API";
import { Errors } from "./Errors";
import type {
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
    const response = await this.wrapGet<Repository[]>(
      `https://api.github.com/user/repos?${params.toString()}`,
      token,
    );
    if (Errors.isAPIEror(response)) {
      return response;
    }
    return response;
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
    return response;
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
    const response = await this.wrapGet<Repository[]>(
      `https://api.github.com/orgs/${organization_name}/repos?${params.toString()}`,
      token,
    );
    if (Errors.isAPIEror(response)) {
      return response;
    }
    return response;
  }
}
