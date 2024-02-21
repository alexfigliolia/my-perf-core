import type {
  InstallationEvent,
  Repository,
  RepositoryEvent,
} from "@octokit/webhooks-types";

export type GithubEventStream = {
  installation: InstallationEvent;
  repository: RepositoryEvent;
};

export type WebHookEvent = Extract<keyof GithubEventStream, string>;

export interface AccessToken {
  access_token: string;
  token_type: "bearer";
  scope: string;
}

export interface GithubUser {
  login: string;
  id: string;
  avatar_url: string;
  url: string;
  type: string;
  name: string;
}

export interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
}

export interface IInstallationRepositoryResponse {
  total_count: number;
  repositories: Repository[];
}

export interface InstallationRepositoryQuery {
  page?: string | null;
  per_page?: string | null;
}

export interface ListRepositoryQuery extends InstallationRepositoryQuery {
  sort?: string | null;
}

export interface ListOrganizationRepositoryQuery extends ListRepositoryQuery {
  organization_name: string;
}

export interface GithubAPIError {
  message: string;
  documentation_url: string;
}

export interface IInstallationToken {
  token: string;
  expires_at: string;
  permissions: Record<string, string>;
  repository_selection: string;
}

export interface ITokenValidation {
  token: string;
  expiration: string;
  installation_id: number;
}
