import { type GraphQLFieldConfig, GraphQLInt } from "graphql";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { TeamController } from "./Controller";
import {
  StandoutType,
  TeamMeshType,
  TeamProfilesPerUserType,
  TeamStatsType,
} from "./GQLTypes";
import type { IByTeam, IByTeammate } from "./types";

export const overallStatsPerUser: GraphQLFieldConfig<any, Context, IByTeam> = {
  type: SchemaBuilder.nonNull(TeamStatsType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    teamId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return TeamController.overallStatsPerUser(args);
  },
};

export const standouts: GraphQLFieldConfig<any, Context, IByTeam> = {
  type: SchemaBuilder.nonNullArray(StandoutType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    teamId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return TeamController.getStandouts(args);
  },
};

export const teammateStats: GraphQLFieldConfig<any, Context, IByTeammate> = {
  type: SchemaBuilder.nonNull(TeamProfilesPerUserType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    userId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return TeamController.getTeammateStats(args);
  },
};

export const teamMesh: GraphQLFieldConfig<any, Context, IByTeam> = {
  type: SchemaBuilder.nonNull(TeamMeshType),
  args: {
    teamId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return TeamController.getMesh(args);
  },
};
