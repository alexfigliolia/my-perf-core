import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLScalarType,
  GraphQLString,
} from "graphql";
import { PlatformType } from "Schema/Resolvers/Platform/GQLTypes";
import { SchemaBuilder } from "Schema/Utilities";
import type { IMesh } from "./types";

export const InputRepositoryType = new GraphQLInputObjectType({
  name: "InputRepository",
  fields: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    api_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    html_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    clone_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    created_at: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    updated_at: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    platform: {
      type: SchemaBuilder.nonNull(PlatformType),
    },
    platform_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    language: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
  },
});

export const UserContributionsInputType = new GraphQLInputObjectType({
  name: "UserContributionsInput",
  fields: {
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    lines: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    commits: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
});

export const ScheduleType = new GraphQLEnumType({
  name: "Schedule",
  values: {
    once: {
      value: "once",
    },
    daily: {
      value: "daily",
    },
    weekly: {
      value: "weekly",
    },
    monthly: {
      value: "monthly",
    },
    yearly: {
      value: "yearly",
    },
  },
});

export const MeshType = new GraphQLScalarType<IMesh, IMesh>({
  name: "Mesh",
  serialize: mesh => {
    return mesh as IMesh;
  },
  parseValue: mesh => {
    return mesh as IMesh;
  },
});

export const PullRequestEntryType = new GraphQLInputObjectType({
  name: "PullRequestEntry",
  fields: {
    author: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    date: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    description: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
});
