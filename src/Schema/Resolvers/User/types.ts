import type { IGithubUser } from "Schema/Resolvers/Github/types";
import type { IBaseOrganizationWithUserRole } from "Schema/Resolvers/Organization/types";

export interface IBaseUser {
  id: number;
  name: string;
  github: IGithubUser | null;
}

export interface IUserAndAffiliations {
  user: IBaseUser;
  organizations: IBaseOrganizationWithUserRole[];
}

export interface Email {
  email: string;
  primary?: boolean;
  verified?: boolean;
}
