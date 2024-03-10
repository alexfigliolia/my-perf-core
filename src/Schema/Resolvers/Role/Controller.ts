import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import { ORM } from "ORM";
import type { IAddNewUserToTeam } from "Schema/Resolvers/User/types";
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

  public static addRolesToUser(
    userId: number,
    { role, teamId, organizationId }: IAddNewUserToTeam,
  ) {
    return ORM.query(
      ORM.user.update({
        where: { id: userId },
        data: {
          teams: {
            connect: {
              id: teamId,
            },
          },
          organizations: {
            connect: {
              id: organizationId,
            },
          },
          roles: {
            create: {
              role,
              organizationId,
            },
          },
          teamRoles: {
            create: {
              role,
              teamId,
              organizationId,
            },
          },
        },
      }),
      error => {
        if (error.message.startsWith("Unique")) {
          throw Errors.createError(
            "BAD_REQUEST",
            "This user is already on this team",
            error,
          );
        }
        throw Errors.createError(
          "BAD_REQUEST",
          "Something went wrong. Please try again",
          error,
        );
      },
    );
  }
}
