import type { InstallationType } from "@prisma/client";
import type {
  InstallationRepositoryQuery,
  ListRepositoryQuery,
} from "Github/API";

export interface IInstallationRepositories extends InstallationRepositoryQuery {
  installation_id: number;
}

export interface IOrganizationRepositories extends ListRepositoryQuery {
  organization_name: string;
  installation_id: number;
}

export interface IAvailableRepositories extends IOrganizationRepositories {
  type: InstallationType;
}
