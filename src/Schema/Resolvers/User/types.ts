import type { IGithubUser } from "Schema/Resolvers/GithubConnection/types";
import type { IBaseOrganizationWithUserRole } from "Schema/Resolvers/Organization/types";

export interface IBaseUser {
  id: number;
  name: string;
  email: string;
  verified: boolean;
  github: IGithubUser | null;
}

export interface IUserAndAffiliations {
  user: IBaseUser;
  organizations: IBaseOrganizationWithUserRole[];
}
