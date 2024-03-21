import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
} from "graphql";
import { PullRequestType } from "Schema/Resolvers/PullRequests/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type {
  IDAndName,
  ITeammateProfile,
  ITeamMesh,
  Standout,
  StatsEntry,
  TeamStats,
} from "./types";

export const OverallStatsPerUserBaseType = new GraphQLObjectType<
  Omit<StatsEntry, "linesPerMonth">
>({
  name: "OverallStatsPerUserBase",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: entry => entry.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: entry => entry.name,
    },
    lines: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: entry => entry.lines,
    },
    commits: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: entry => entry.commits,
    },
    pullRequests: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: entry => entry.pullRequests,
    },
  },
});

export const OverallStatsPerUserType = new GraphQLObjectType<
  StatsEntry,
  Context
>({
  name: "OverallStatsPerUser",
  fields: {
    ...OverallStatsPerUserBaseType.toConfig().fields,
    linesPerMonth: {
      type: SchemaBuilder.nonNullArray(GraphQLInt),
      resolve: entry => entry.linesPerMonth,
    },
  },
});

export const TeammateCollaboratorType = new GraphQLObjectType({
  name: "TeammateCollaborator",
  fields: {
    ...OverallStatsPerUserType.toConfig().fields,
    totalLines: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
});

export const TeammateProfileType = new GraphQLObjectType<
  ITeammateProfile,
  Context
>({
  name: "TeammateProfile",
  fields: {
    ...OverallStatsPerUserBaseType.toConfig().fields,
    linesPerMonth: {
      type: SchemaBuilder.nonNullArray(GraphQLInt),
      resolve: entry => entry.linesPerMonth,
    },
    pullRequests: {
      type: SchemaBuilder.nonNullArray(PullRequestType),
      resolve: entry => entry.pullRequests,
    },
    collaborators: {
      type: SchemaBuilder.nonNullArray(TeammateCollaboratorType),
    },
  },
});

export const TeamProjectType = new GraphQLObjectType<IDAndName, Context>({
  name: "TeamProject",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
});

export const ProjectTrendType = new GraphQLObjectType<any, Context>({
  name: "ProjectTrend",
  fields: {
    trend: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    trackedProjects: {
      type: SchemaBuilder.nonNullArray(TeamProjectType),
    },
  },
});

export const TeamStatsType = new GraphQLObjectType<TeamStats, Context>({
  name: "TeamStats",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: team => team.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: team => team.name,
    },
    totalLines: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: team => team.totalLines,
    },
    lineTrend: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: team => team.lineTrend,
    },
    totalCommits: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: team => team.totalCommits,
    },
    commitTrend: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: team => team.commitTrend,
    },
    users: {
      type: SchemaBuilder.nonNullArray(OverallStatsPerUserType),
      resolve: team => team.users,
    },
    projects: {
      type: SchemaBuilder.nonNull(ProjectTrendType),
    },
  },
});

export const StandoutType = new GraphQLObjectType<Standout, Context>({
  name: "Standout",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: entry => entry.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: entry => entry.name,
    },
    lines: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: entry => entry.lines,
    },
    increase: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: entry => entry.increase,
    },
  },
});

export const MatrixType = new GraphQLScalarType<number[][], number[][]>({
  name: "Matrix",
  serialize: matrix => {
    return matrix as number[][];
  },
  parseValue: matrix => {
    return matrix as number[][];
  },
});

export const TeamMeshType = new GraphQLObjectType<ITeamMesh, Context>({
  name: "TeamMesh",
  fields: {
    key: {
      type: SchemaBuilder.nonNullArray(GraphQLString),
      resolve: mesh => mesh.key,
    },
    mesh: {
      type: SchemaBuilder.nonNull(MatrixType),
      resolve: mesh => mesh.mesh,
    },
  },
});
