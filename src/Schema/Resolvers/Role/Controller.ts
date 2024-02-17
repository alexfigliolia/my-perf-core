import { ORM } from "ORM";
import type { ICreateRole } from "./types";

export class RoleController {
  public static create({ userId, organizationId, role }: ICreateRole) {
    return ORM.query({
      transaction: DB => {
        return DB.userRole.create({
          data: {
            role,
            userId,
            organizationId,
          },
        });
      },
      onResult: data => data,
      onError: _ => {},
    });
  }
}
