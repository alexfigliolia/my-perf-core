import type { InstallationType, Platform } from "@prisma/client";
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

export interface IAvailableRepository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string;
  platform: Platform;
  api_url: string;
  platform_id: number;
}
