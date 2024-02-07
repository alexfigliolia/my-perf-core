import type { IBaseOrganizationWithUserRole } from "Schema/Resolvers/Organization/types";

export interface IBaseUser {
  id: number;
  name: string;
  email: string;
  verified: boolean;
}

export interface IUserAndAffiliations {
  user: IBaseUser;
  organizations: IBaseOrganizationWithUserRole[];
}
