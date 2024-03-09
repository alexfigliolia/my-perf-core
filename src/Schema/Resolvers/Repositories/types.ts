import type { Platform } from "@prisma/client";
import type { IOrganizationSearchScope } from "Schema/Resolvers/Organization/types";

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
