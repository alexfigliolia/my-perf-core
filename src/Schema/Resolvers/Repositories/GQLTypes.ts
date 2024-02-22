import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { PlatformType } from "Schema/Resolvers/Platform/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IAvailableRepository } from "./types";

export const AvailableRepositoryType = new GraphQLObjectType<
  IAvailableRepository,
  Context
>({
  name: "AvailableRepository",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: repo => repo.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.name,
    },
    description: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.description,
    },
    html_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.html_url,
    },
    api_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.api_url,
    },
    clone_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.clone_url,
    },
    tracked: {
      type: SchemaBuilder.nonNull(GraphQLBoolean),
      resolve: repo => repo.tracked,
    },
    language: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.language,
    },
    platform: {
      type: SchemaBuilder.nonNull(PlatformType),
      resolve: repo => repo.platform,
    },
    platform_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: repo => repo.platform,
    },
    created_at: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.created_at,
    },
    updated_at: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.updated_at,
    },
  },
});
