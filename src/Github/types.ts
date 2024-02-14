import type { InstallationEvent } from "@octokit/webhooks-types/";

export type GithubEventStream = {
  installation: InstallationEvent;
};

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
