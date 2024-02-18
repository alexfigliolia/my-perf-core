export interface IGithubCode {
  code: string;
}

export interface ICreateGithubUser extends IGithubCode {
  name: string;
  installation_id: number;
}

export interface IGithubUserAuthorization {
  id: string;
  token: string;
}
