import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { PlatformType } from "Schema/Resolvers/Platform/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { ITrackedRepository } from "./types";

export const TrackedRepositoryType = new GraphQLObjectType<
  ITrackedRepository,
  Context
>({
  name: "TrackedRepository",
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
    language: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.language,
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: repo => repo.organizationId,
    },
    platform: {
      type: SchemaBuilder.nonNull(PlatformType),
      resolve: repo => repo.platform,
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
    platform_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: repo => repo.platform_id,
    },
  },
});
