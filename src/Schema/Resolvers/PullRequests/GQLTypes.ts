import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IPullRequest } from "./types";

export const PullRequestType = new GraphQLObjectType<IPullRequest, Context>({
  name: "PullRequest",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: PR => PR.id,
    },
    date: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: PR => PR.date,
    },
    author: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: PR => PR.author,
    },
    description: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: PR => PR.description,
    },
    project: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: PR => PR.project,
    },
  },
});
