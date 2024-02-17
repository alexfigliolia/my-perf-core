import type { Platform } from "@prisma/client";

export interface ICreateInstallation {
  installation_id: number;
  platform: Platform;
}

export interface IInstallation extends ICreateInstallation {
  id: number;
  organizationId: number | null;
}
