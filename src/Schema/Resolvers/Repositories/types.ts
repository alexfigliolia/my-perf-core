import type { Platform } from "@prisma/client";

export interface IRepository {
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
  repositories: InputRepository[];
}
