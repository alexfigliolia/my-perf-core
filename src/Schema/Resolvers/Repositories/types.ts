import type { Platform } from "@prisma/client";

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

export interface IAvailableRepositories {
  offset?: number;
  limit?: number;
  search?: string;
  organizationId: number;
  sort?: IRepositorySortKeys;
}

export interface ITrackedRepositories {
  organizationId: number;
}

export interface ITrackRepository {
  id: number;
}
