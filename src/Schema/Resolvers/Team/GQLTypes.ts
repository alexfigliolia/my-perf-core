import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { Standout, StatsEntry, TeamStats } from "./types";

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

export const TeamStatsType = new GraphQLObjectType<TeamStats, Context>({
  name: "TeamStats",
  fields: {
    totalLines: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: team => team.totalLines,
    },
    totalCommits: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: team => team.totalCommits,
    },
    users: {
      type: SchemaBuilder.nonNullArray(OverallStatsPerUserType),
      resolve: team => team.users,
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
