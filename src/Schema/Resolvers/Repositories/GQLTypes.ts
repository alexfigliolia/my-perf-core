import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { PlatformType } from "../Platform/GQLTypes";
import type { IAvailableRepository } from "./types";

export const AvailableRepositoryType = new GraphQLObjectType<
  IAvailableRepository,
  Context
>({
  name: "AvailableRepository",
  fields: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.name,
    },
    description: {
      type: GraphQLString,
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
    language: {
      type: GraphQLString,
      resolve: repo => repo.language,
    },
    platform: {
      type: SchemaBuilder.nonNull(PlatformType),
      resolve: repo => repo.platform,
    },
    platform_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: repo => repo.platform_id,
    },
  },
});
