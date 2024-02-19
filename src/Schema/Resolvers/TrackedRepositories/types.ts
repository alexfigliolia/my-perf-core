import type { Platform } from "@prisma/client";

export interface TrackedRepositoriesByOrg {
  organizationId: number;
}

export interface TrackRepositoryArgs extends TrackedRepositoriesByOrg {
  name: string;
  description: string;
  language: string;
  platform: Platform;
  api_url: string;
  html_url: string;
  platform_id: number;
}

export interface ITrackedRepository extends TrackRepositoryArgs {
  id: number;
}
