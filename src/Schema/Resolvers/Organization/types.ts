import type { Platform, UserRole } from "@prisma/client";

export interface IBaseOrganization {
  id: number;
  name: string;
  platform: Platform;
}

export interface IBaseOrganizationWithUserRole extends IBaseOrganization {
  role: UserRole;
}
