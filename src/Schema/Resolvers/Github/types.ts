import type { RepositoryQuery } from "Github";

export interface IGithubCode {
  code: string;
}

export interface IInstallationID {
  installation_id: number;
}

export interface ICreateGithubUser extends IGithubCode {
  orgID: number;
}

export interface IGithubAuthorization {
  id: string;
  token: string;
}

export interface ISearchRepositories extends RepositoryQuery {
  userId: number;
}
