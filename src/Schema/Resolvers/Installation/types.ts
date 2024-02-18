import type { InstallationType, Platform } from "@prisma/client";

export interface IToken {
  token: string;
  expiration: string;
}

export interface ICreateInstallation {
  type: InstallationType;
  installation_id: number;
  platform: Platform;
}

export interface IInstallation extends ICreateInstallation {
  id: number;
  organizationId: number | null;
}

export type TokenList = { token: string; platform: Platform }[];
