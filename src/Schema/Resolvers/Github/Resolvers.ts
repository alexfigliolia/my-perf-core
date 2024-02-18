import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { GithubController } from "./Controller";
import type { ICreateGithubUser } from "./types";

export const createGithubAccount: GraphQLFieldConfig<
  any,
  Context,
  ICreateGithubUser
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    code: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    installation_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_, args, context) => {
    const { userId, token } = await GithubController.createAccount(
      args,
      "admin",
    );
    context.req.session.loggedIn = true;
    context.req.session.userID = userId;
    context.req.session.githubUserToken = token;
    return true;
  },
};
