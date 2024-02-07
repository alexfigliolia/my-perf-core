import type { UserRole } from "@prisma/client";

export interface IBaseRole {
  type: UserRole;
}
