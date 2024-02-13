import type { InstallationEvent } from "@octokit/webhooks-types/";

export type GithubEventStream = {
  installation: InstallationEvent;
};

export interface AccessToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
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
  email: string;
}

export interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
}
