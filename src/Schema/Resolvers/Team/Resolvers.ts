import { type GraphQLFieldConfig, GraphQLInt } from "graphql";
import type { IByOrganization } from "Schema/Resolvers/Organization/types";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { TeamController } from "./Controller";
import { StandoutType, TeamStatsType } from "./GQLTypes";

export const overallStatsPerUser: GraphQLFieldConfig<
  any,
  Context,
  IByOrganization
> = {
  type: SchemaBuilder.nonNull(TeamStatsType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return TeamController.overallStatsPerUser(args.organizationId);
  },
};

export const standouts: GraphQLFieldConfig<any, Context, IByOrganization> = {
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
