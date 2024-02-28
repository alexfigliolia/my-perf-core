import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { Subscriptions } from "Subscriptions";
import { AsyncController } from "./Controller";
import { InputRepositoryType, UserContributionsInputType } from "./GQLTypes";
import type { IIndexRepoStats, ISetRepositories } from "./types";

export const setOrganizationRepositories: GraphQLFieldConfig<
  any,
  Context,
  ISetRepositories
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    repositories: {
      type: SchemaBuilder.nonNullArray(InputRepositoryType),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: async (_, args) => {
    const repos = await AsyncController.indexRepositories(args);
    Subscriptions.publish("newRepositories", args.organizationId, repos);
    return true;
  },
};

export const setRepositoryStats: GraphQLFieldConfig<
  any,
  Context,
  IIndexRepoStats
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    lines: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    date: {
      type: GraphQLString,
    },
    commits: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    userStats: {
      type: SchemaBuilder.nonNullArray(UserContributionsInputType),
    },
    repositoryId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: async (_, args) => {
    await AsyncController.indexRepositoryStats(args);
    return true;
  },
};
