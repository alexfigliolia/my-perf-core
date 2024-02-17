import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import type { IGithubRepository } from "Github";
import {
  OrganizationController,
  OrganizationType,
} from "Schema/Resolvers/Organization";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { Subscriptions } from "Subscriptions";
import { GithubController } from "./Controller";
import type {
  ICreateGithubUser,
  IGithubAuthorization,
  IInstallationID,
  ISearchRepositories,
} from "./types";

export const GithubAuthorizationType = new GraphQLObjectType<
  IGithubAuthorization,
  Context
>({
  name: "GithubAuthorizationType",
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

export const githubOrganizationSetup: GraphQLFieldConfig<
  any,
  Context,
  IInstallationID
> = {
  type: SchemaBuilder.nonNull(OrganizationType),
  args: {
    installation_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  subscribe: (_, { installation_id }) => {
    return Subscriptions.subscribe("newOrganization", installation_id);
  },
  resolve: (_, { installation_id }) => {
    return OrganizationController.findInstallation({
      installation_id,
      platform: "github",
    });
  },
};

export const createUserFromGithubInstallation: GraphQLFieldConfig<
  any,
  Context,
  ICreateGithubUser
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    code: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    orgID: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: async (_, args, context) => {
    const auth = await GithubController.createUser(args, "admin");
    context.req.session.loggedIn = true;
    context.req.session.userID = auth.userId;
    context.req.session.githubToken = auth.token;
    return true;
  },
};
