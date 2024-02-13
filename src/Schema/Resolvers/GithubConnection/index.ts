import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { GithubController } from "./Controller";
import type { GithubCode, IGithubUser } from "./types";

export const GithubUser = new GraphQLObjectType<IGithubUser, Context>({
  name: "GithubUser",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: user => user.id,
    },
    token: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.token,
    },
    refresh_token: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.refresh_token,
    },
  },
});

export const connectWithGithub: GraphQLFieldConfig<any, Context, GithubCode> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    code: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_, args) => {
    await GithubController.createUser(args);
    return true;
  },
};
