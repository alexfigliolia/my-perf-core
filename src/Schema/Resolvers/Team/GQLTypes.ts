import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { Standout, StatsEntry, TeamStats, TrackedProject } from "./types";

export const OverallStatsPerUserType = new GraphQLObjectType<
  StatsEntry,
  Context
>({
  name: "OverallStatsPerUser",
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
    linesPerMonth: {
      type: SchemaBuilder.nonNullArray(GraphQLInt),
      resolve: entry => entry.linesPerMonth,
    },
  },
});

export const TeamProjectType = new GraphQLObjectType<TrackedProject, Context>({
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
