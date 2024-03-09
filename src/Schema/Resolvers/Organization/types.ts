import type { Platform, Role } from "@prisma/client";

export interface IInstallationParams {
  installation_id: number;
  platform: Platform;
}

export interface IOrganizationParams extends IInstallationParams {
  name: string;
}

export interface IOrgAffiliation {
  id: number;
  name: string;
  roles: {
    role: Role;
  }[];
  installations: {
    platform: Platform;
  }[];
}

export type EmailMapTuple = [
  emails: Set<string> | undefined,
  emailToUserID: Map<string, number> | undefined,
];

export interface IByOrganization {
  organizationId: number;
}

export interface IOrganizationSearchScope extends IByOrganization {
  offset?: number;
  limit?: number;
  search?: string;
  organizationId: number;
}
