import { GraphQLError } from "graphql";
import { Errors } from "Errors";
import { ORM } from "ORM/ORM";
import type { TrackRepositoryArgs } from "./types";

export class TrackedRepositoriesController {
  public static track(args: TrackRepositoryArgs) {
    return ORM.query({
      transaction: DB => {
        return DB.trackedRepository.create({
          data: args,
        });
      },
      onResult: data => data,
      onError: error => {
        throw new GraphQLError("Something went wrong. Please try again", {
          extensions: Errors.UNEXPECTED_ERROR,
          originalError: error,
        });
      },
    });
  }

  public static list(organizationId: number) {
    return ORM.query({
      transaction: DB => {
        return DB.trackedRepository.findMany({
          where: {
            organizationId,
          },
        });
      },
      onResult: data => data,
      onError: error => {
        throw new GraphQLError("Something went wrong. Please try again", {
          extensions: Errors.UNEXPECTED_ERROR,
          originalError: error,
        });
      },
    });
  }
}
