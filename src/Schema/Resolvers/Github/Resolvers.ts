import {
  GraphQLBoolean,
  GraphQLError,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { Errors } from "Errors";
import { Github, type RepositoryQuery } from "Github";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { GithubController } from "./Controller";
import { GithubRepository } from "./GQLTypes";
import type { ICreateGithubUser } from "./types";

export const listAvailableRepositories: GraphQLFieldConfig<
  any,
  Context,
  RepositoryQuery
> = {
  type: SchemaBuilder.nonNullArray(GithubRepository),
  args: {
    sort: {
      type: GraphQLString,
    },
    page: {
      type: GraphQLString,
    },
  },
  resolve: (_, args, context) => {
    const token = context.req.session.githubToken;
    if (!token) {
      throw new GraphQLError("Unauthorized", {
        extensions: Errors.UNAUTHORIZED,
      });
    }
    return Github.Repositories.list(token, args);
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
