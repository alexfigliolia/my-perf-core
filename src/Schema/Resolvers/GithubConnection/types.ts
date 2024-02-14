import type { RepositoryQuery } from "Github/types";

export interface GithubCode {
  code: string;
}

export interface IGithubUser {
  id: string;
  token: string;
}

export interface ISearchRepositories extends RepositoryQuery {
  userId: number;
}
