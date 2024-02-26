import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { PlatformType } from "Schema/Resolvers/Platform/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IRepository } from "./types";

export const RepositoryType = new GraphQLObjectType<IRepository, Context>({
  name: "Repository",
  fields: {
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
