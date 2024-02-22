import type { InstallationType, Platform } from "@prisma/client";
import type { IPaginatedQuery } from "Schema/Utilities";

export interface IAvailableRepository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  clone_url: string;
  language: string;
  platform: Platform;
  api_url: string;
  tracked: boolean;
  platform_id: number;
  created_at: string;
  updated_at: string;
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

export interface IRepositoryQuery
  extends IPaginatedQuery<IAvailableRepository> {
  organizationId: number;
}
