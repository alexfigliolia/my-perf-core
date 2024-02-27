import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { Subscriptions } from "Subscriptions";
import { RepositoryController } from "./Controller";
import {
  InputRepositoryType,
  RepositorySortKeysType,
  RepositoryType,
} from "./GQLTypes";
import type {
  IAvailableRepositories,
  ISetRepositories,
  ITrackedRepositories,
  ITrackRepository,
} from "./types";

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
    const repos = await RepositoryController.createMany(args);
    Subscriptions.publish("newRepositories", args.organizationId, repos);
    return true;
  },
};

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
  ITrackedRepositories
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
  resolve: (_, args) => {
    return RepositoryController.trackRepository(args.id);
  },
};
