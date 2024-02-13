import type { UserRole } from "@prisma/client";

export interface IBaseOrganization {
  id: number;
  name: string;
}

export interface IBaseOrganizationWithUserRole extends IBaseOrganization {
  role: UserRole;
}

export interface ICreateOrganization {
  name: string;
  ownerID: number;
}
