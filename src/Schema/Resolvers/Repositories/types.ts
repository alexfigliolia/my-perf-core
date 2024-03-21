import type { Platform } from "@prisma/client";
import type {
  IByOrganization,
  IOrganizationSearchScope,
} from "Schema/Resolvers/Organization/types";
import type { IByTeam } from "Schema/Resolvers/Team/types";

export interface IRepository {
  id: number;
  name: string;
  api_url: string;
  html_url: string;
  language: string;
  clone_url: string;
  created_at: string;
  updated_at: string;
  platform: Platform;
  platform_id: number;
  description: string;
}

export type IRepositorySortKeys =
  | "name"
  | "created_at"
  | "updated_at"
  | "language";

export interface IAvailableRepositories extends IOrganizationSearchScope {
  sort?: IRepositorySortKeys;
}

export interface ITrackRepository {
  id: number;
}

export interface ITrackedRepository extends ITrackRepository {
  repository: IRepository;
}

export interface IByOptionalTeam extends IByOrganization {
  teamId?: number;
}

export interface IByRepository extends IByTeam {
  repositoryId: number;
}

export interface StatsPerRepo {
  lines: number;
  commits: number;
}

export interface IProjectCount extends StatsPerRepo {
  totalProjects: number;
}

export interface ITotalRepos extends IByOrganization {
  tracked?: boolean;
}
