import { type GraphQLFieldConfig, GraphQLInt } from "graphql";
import type { ITrackedRepositories } from "Schema/Resolvers/Repositories/types";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { TeamController } from "./Controller";
import { OverallStatsPerUserType, StandoutType } from "./GQLTypes";

export const overallStatsPerUser: GraphQLFieldConfig<
  any,
  Context,
  ITrackedRepositories
> = {
  type: SchemaBuilder.nonNullArray(OverallStatsPerUserType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return TeamController.getHighestContributors(args.organizationId);
  },
};

export const standouts: GraphQLFieldConfig<any, Context, ITrackedRepositories> =
  {
    type: SchemaBuilder.nonNullArray(StandoutType),
    args: {
      organizationId: {
        type: SchemaBuilder.nonNull(GraphQLInt),
      },
    },
    resolve: (_, args) => {
      return TeamController.getStandouts(args.organizationId);
    },
  };
