import type { InstallationEvent } from "@octokit/webhooks-types/";

export type GithubEventStream = {
  installation: InstallationEvent;
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

export interface IGithubRepository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string;
  source: "github";
}

export interface RepositoryQuery {
  sort?: string | null;
  page?: string | null;
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
