import { GraphQLError } from "graphql";
import { Errors } from "Errors";
import { ORM } from "ORM";
import type { ICreateRole } from "./types";

export class RoleController {
  public static create({ userId, organizationId, role }: ICreateRole) {
    return ORM.userRole
      .create({
        data: {
          role,
          userId,
          organizationId,
        },
      })
      .catch(error => {
        throw new GraphQLError("Failed to create user role", {
          extensions: Errors.UNEXPECTED_ERROR,
          originalError: error,
        });
      });
  }
}
