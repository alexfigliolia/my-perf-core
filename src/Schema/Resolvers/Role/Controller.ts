import { DB } from "DB";
import type { ICreateRole } from "./types";

export class RoleController {
  public static create({ userId, organizationId, role }: ICreateRole) {
    return DB.userRole.create({
      data: {
        role,
        userId,
        organizationId,
      },
    });
  }
}
