import type { RepositoryQuery } from "Github";

export interface IGithubCode {
  code: string;
}

export interface ICreateGithubUser extends IGithubCode {
  name: string;
  installation_id: number;
}

export interface IGithubAuthorization {
  id: string;
  token: string;
}

export interface ISearchRepositories extends RepositoryQuery {
  userId: number;
}
