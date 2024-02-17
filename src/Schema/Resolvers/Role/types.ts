import type { Role } from "@prisma/client";

export interface IBaseRole {
  role: Role;
}

export interface ICreateRole {
  role: Role;
  userId: number;
  organizationId: number;
}
