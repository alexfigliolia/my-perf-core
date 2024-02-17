import type { Platform, Role } from "@prisma/client";

export interface IInstallationParams {
  installation_id: number;
  platform: Platform;
}

export interface IOrganizationParams extends IInstallationParams {
  name: string;
}

export interface IOrganization extends IOrganizationParams {
  id: number;
}

export interface IOrgAffiliation {
  id: number;
  name: string;
  roles: {
    role: Role;
  }[];
  platform: Platform;
}
