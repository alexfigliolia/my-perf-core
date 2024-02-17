import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { GithubController } from "./Controller";
import { GithubRepository } from "./GQLTypes";
import type { ICreateGithubUser, ISearchRepositories } from "./types";

export const listAvailableRepositories: GraphQLFieldConfig<
  any,
  Context,
  ISearchRepositories
> = {
  type: SchemaBuilder.nonNullArray(GithubRepository),
  args: {
    userId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    sort: {
      type: GraphQLString,
    },
    page: {
      type: GraphQLString,
    },
  },
  resolve: (_, args) => {
    return GithubController.listUserRepositores(args);
  },
};

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
    const auth = await GithubController.createAccount(args, "admin");
    context.req.session.loggedIn = true;
    context.req.session.userID = auth.userId;
    context.req.session.githubToken = auth.token;
    return true;
  },
};