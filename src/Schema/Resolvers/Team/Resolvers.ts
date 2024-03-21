import { type GraphQLFieldConfig, GraphQLInt } from "graphql";
import { PullRequestType } from "Schema/Resolvers/PullRequests/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { TeamController } from "./Controller";
import {
  StandoutType,
  TeammateProfileType,
  TeamMeshType,
  TeamStatsType,
} from "./GQLTypes";
import type { IByTeam, IByTeammate, IGetPRs } from "./types";

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

export const teammateProfile: GraphQLFieldConfig<any, Context, IByTeammate> = {
  type: SchemaBuilder.nonNull(TeammateProfileType),
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

export const teamPullRequests: GraphQLFieldConfig<any, Context, IGetPRs> = {
  type: SchemaBuilder.nonNullArray(PullRequestType),
  args: {
    teamId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    page: {
      type: GraphQLInt,
    },
  },
  resolve: (_, args) => {
    return TeamController.getPRs(args);
  },
};
