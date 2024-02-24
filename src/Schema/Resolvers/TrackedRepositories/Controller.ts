import { GraphQLError } from "graphql";
import { Errors } from "Errors";
import { ORM } from "ORM";
import type { ITrackRepository } from "./types";

export class TrackedRepositoriesController {
  public static track({ id }: ITrackRepository) {
    return ORM.repository
      .update({
        where: { id },
        data: {
          tracked: true,
        },
      })
      .catch(error => {
        throw new GraphQLError("Something went wrong. Please try again", {
          extensions: Errors.UNEXPECTED_ERROR,
          originalError: error,
        });
      });
  }

  public static list(organizationId: number) {
    return ORM.repository
      .findMany({
        where: {
          AND: [{ organizationId }, { tracked: true }],
        },
      })
      .catch(error => {
        throw new GraphQLError("Something went wrong. Please try again", {
          extensions: Errors.UNEXPECTED_ERROR,
          originalError: error,
        });
      });
  }
}
