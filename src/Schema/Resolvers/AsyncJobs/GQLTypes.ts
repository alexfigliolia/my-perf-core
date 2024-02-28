import { GraphQLInputObjectType, GraphQLInt, GraphQLString } from "graphql";
import { PlatformType } from "Schema/Resolvers/Platform/GQLTypes";
import { SchemaBuilder } from "Schema/Utilities";

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
