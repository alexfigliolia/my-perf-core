import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { Standout, StatsEntry } from "./types";

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
