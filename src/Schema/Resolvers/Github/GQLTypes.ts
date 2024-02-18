import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import type { IGithubUserAuthorization } from "./types";

export const GithubUserAuthorizationType = new GraphQLObjectType<
  IGithubUserAuthorization,
  Context
>({
  name: "GithubUserAuthorizationType",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: user => user.id,
    },
    token: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.token,
    },
  },
});
