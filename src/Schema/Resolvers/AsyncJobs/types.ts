import type { InstallationType, Platform } from "@prisma/client";
import type { Schedule } from "GQL/AsyncService/Types";
import type { StatsPerRepo } from "Schema/Resolvers/Repositories/types";

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

export interface IRegisterCloneJob {
  token: string;
  clone_url: string;
  repositoryId: number;
  organizationId: number;
}

export interface IUserStats extends StatsPerRepo {
  email: string;
}

export interface IPullRequestEntry {
  date: string;
  author: string;
  description: string;
}

export interface IIndexRepoStats extends StatsPerRepo {
  mesh: IMesh;
  range?: Schedule;
  repositoryId: number;
  organizationId: number;
  userStats: IUserStats[];
  pullRequests: IPullRequestEntry[];
}

export type FilteredContributions = [
  emailMap: Map<string, number>,
  stats: IUserStats[],
];

export type IMesh = Record<string, Record<string, number>>;
