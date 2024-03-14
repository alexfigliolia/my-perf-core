import { GraphQLBoolean, type GraphQLFieldConfig, GraphQLInt } from "graphql";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { Subscriptions } from "Subscriptions";
import {
  InputRepositoryType,
  ScheduleType,
  UserContributionsInputType,
} from "./GQLTypes";
import { Receivers } from "./Receivers";
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
    const repos = await Receivers.Repositories.indexRepositories(args);
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
    range: {
      type: ScheduleType,
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
    await Receivers.Stats.indexRepositoryStats(args);
    return true;
  },
};
