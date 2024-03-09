import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { PlatformType } from "Schema/Resolvers/Platform/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IRepository, ITrackedRepository } from "./types";

export const RepositorySortKeysType = new GraphQLEnumType({
  name: "RepositorySortKeys",
  values: {
    name: {
      value: "name",
    },
    created_at: {
      value: "created_at",
    },
    updated_at: {
      value: "updated_at",
    },
    language: {
      value: "language",
    },
  },
});

export const RepositoryType = new GraphQLObjectType<IRepository, Context>({
  name: "Repository",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: repo => repo.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.name,
    },
    api_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.api_url,
    },
    html_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.html_url,
    },
    clone_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.clone_url,
    },
    created_at: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.created_at,
    },
    updated_at: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.updated_at,
    },
    platform: {
      type: SchemaBuilder.nonNull(PlatformType),
      resolve: repo => repo.platform,
    },
    platform_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: repo => repo.platform_id,
    },
    language: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.language,
    },
    description: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.description,
    },
  },
});

export const TrackedRepositoryType = new GraphQLObjectType<
  ITrackedRepository,
  Context
>({
  name: "TrackedRepositoryType",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: tracking => tracking.id,
    },
    repository: {
      type: SchemaBuilder.nonNull(RepositoryType),
      resolve: tracking => tracking.repository,
    },
  },
});
