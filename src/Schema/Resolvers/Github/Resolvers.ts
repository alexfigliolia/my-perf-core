import {
  GraphQLBoolean,
  GraphQLError,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { Errors } from "Errors";
import { Repositories, type RepositoryQuery } from "Github";
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
    const token = context.req.session.githubUserToken;
    if (!token) {
      throw new GraphQLError("Unauthorized", {
        extensions: Errors.UNAUTHORIZED,
      });
    }
    return Repositories.list(token, args);
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
    const {
      userAuth: { userId, token },
      installTokens: { github, bitbucket },
    } = await GithubController.createAccount(args, "admin");
    context.req.session.loggedIn = true;
    context.req.session.userID = userId;
    context.req.session.githubUserToken = token;
    context.req.session.githubInstallationToken = github;
    context.req.session.bitbucketInstallationToken = bitbucket;
    return true;
  },
};
