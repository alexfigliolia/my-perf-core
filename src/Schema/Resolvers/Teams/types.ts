import type {
  IByOrganization,
  IOrganizationSearchScope,
} from "Schema/Resolvers/Organization/types";
import type { ITrackedRepository } from "Schema/Resolvers/Repositories/types";
import type { IBaseRole } from "Schema/Resolvers/Role/types";
import type { IBaseUser } from "Schema/Resolvers/User/types";

export interface ITeam {
  id: number;
  role: IBaseRole;
  name: string;
  users: IBaseUser[];
  organizationId: number;
  projects: ITrackedRepository[];
}

export interface ICreateTeam extends IByOrganization {
  name: string;
}

export interface ISearchTeamsArgs extends IOrganizationSearchScope {
  omitCurrentUser: boolean;
}

export interface ISearchTeams extends ISearchTeamsArgs {
  userId: number;
}
