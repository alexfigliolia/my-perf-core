import { type GraphQLFieldConfig, GraphQLInt, GraphQLString } from "graphql";
import type { IByOrganization } from "Schema/Resolvers/Organization/types";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { Subscriptions } from "Subscriptions";
import { RepositoryController } from "./Controller";
import { RepositorySortKeysType, RepositoryType } from "./GQLTypes";
import type { IAvailableRepositories, ITrackRepository } from "./types";

export const availableRepositories: GraphQLFieldConfig<
  any,
  Context,
  IAvailableRepositories
> = {
  type: SchemaBuilder.nonNullArray(RepositoryType),
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
    sort: {
      type: RepositorySortKeysType,
    },
    search: {
      type: GraphQLString,
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return RepositoryController.list(args);
  },
};

export const availableRepositoriesStream: GraphQLFieldConfig<
  any,
  Context,
  IAvailableRepositories
> = {
  type: SchemaBuilder.nonNullArray(RepositoryType),
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
    sort: {
      type: RepositorySortKeysType,
    },
    search: {
      type: GraphQLString,
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  subscribe: (_, args) => {
    return Subscriptions.subscribe("newRepositories", args.organizationId);
  },
  resolve: (_, args) => {
    return RepositoryController.list(args);
  },
};

export const trackedRepositories: GraphQLFieldConfig<
  any,
  Context,
  IByOrganization
> = {
  type: SchemaBuilder.nonNullArray(RepositoryType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return RepositoryController.trackedRepositories(args);
  },
};

export const trackRepository: GraphQLFieldConfig<
  any,
  Context,
  ITrackRepository
> = {
  type: SchemaBuilder.nonNull(RepositoryType),
  args: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args, context) => {
    return RepositoryController.trackRepository(args.id, context.req.session);
  },
};
