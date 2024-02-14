import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import type { IGithubRepository } from "Github/types";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { GithubController } from "./Controller";
import type { GithubCode, IGithubUser, ISearchRepositories } from "./types";

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
