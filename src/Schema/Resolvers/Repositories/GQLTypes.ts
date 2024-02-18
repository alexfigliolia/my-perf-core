import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { IGithubRepository } from "Github/API";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";

export const GithubRepository = new GraphQLObjectType<
  IGithubRepository,
  Context
>({
  name: "GithubRepository",
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
      type: GraphQLString,
      resolve: repo => repo.description,
    },
    html_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.html_url,
    },
    clone_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.clone_url,
    },
    language: {
      type: GraphQLString,
      resolve: repo => repo.language,
    },
    source: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: repo => repo.source,
    },
  },
});
