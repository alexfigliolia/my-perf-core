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

export interface IAvailableRepositoryQuery extends IOrganizationRepositories {
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

export interface NewOrg {
  id: number;
  name: string;
  installations: {
    id: number;
    platform: Platform;
    token: string;
    type: InstallationType;
  }[];
}

export interface IResumeGithubPull {
  jobId: number;
  token: string;
  organizationId: number;
}
