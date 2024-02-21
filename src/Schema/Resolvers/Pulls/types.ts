import type { Platform } from "@prisma/client";
import type { InstallationType } from "GQLClient/Types";

export interface ICreatePull extends IResumePull {
  name: string;
  type: InstallationType;
}

export interface IResumePull {
  id: number;
  token: string;
}

export type PullIdentifiers = [organizationId: number, platform: Platform];
