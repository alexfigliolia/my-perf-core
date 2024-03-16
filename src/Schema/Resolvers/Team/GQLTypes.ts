import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
} from "graphql";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type {
  IDAndName,
  ITeamMesh,
  Standout,
  StatsEntry,
  TeamProfilesPerUser,
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

export const TeamProfilesPerUserType = new GraphQLObjectType<
  TeamProfilesPerUser,
  Context
>({
  name: "TeamProfilesPerUser",
  fields: {
    ...OverallStatsPerUserBaseType.toConfig().fields,
    teams: {
      type: SchemaBuilder.nonNullArray(OverallStatsPerUserType),
      resolve: entry => entry.teams,
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
