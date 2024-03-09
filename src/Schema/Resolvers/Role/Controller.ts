import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
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
