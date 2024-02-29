import type { InstallationType, Platform } from "@prisma/client";
import type { Schedule } from "GQL/AsyncService/Types";

export interface NewOrg {
  id: number;
  name: string;
  installations: {
    id: number;
    token: string;
    platform: Platform;
    type: InstallationType;
  }[];
}

export interface InputRepository {
  name: string;
  api_url: string;
  html_url: string;
  clone_url: string;
  created_at: string;
  updated_at: string;
  platform: Platform;
  platform_id: number;
  organizationId: number;
  language: string | null;
  description: string | null;
}

export interface ISetRepositories {
  organizationId: number;
  repositories: InputRepository[];
}

export interface IRegisterRepoStatsPull {
  token: string;
  clone_url: string;
  repositoryId: number;
  organizationId: number;
}

export interface IUserStats {
  email: string;
  lines: number;
  commits: number;
}

export interface IIndexRepoStats {
  lines: number;
  range?: Schedule;
  commits: number;
  repositoryId: number;
  organizationId: number;
  userStats: IUserStats[];
}

export type FilteredContributions = [
  emailMap: Map<string, number>,
  stats: IUserStats[],
];
