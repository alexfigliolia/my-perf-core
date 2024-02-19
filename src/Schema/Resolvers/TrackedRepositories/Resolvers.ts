import { type GraphQLFieldConfig, GraphQLInt, GraphQLString } from "graphql";
import type { Context } from "vm";
import { PlatformType } from "Schema/Resolvers/Platform/GQLTypes";
import { SchemaBuilder } from "Schema/Utilities";
import { TrackedRepositoriesController } from "./Controller";
import { TrackedRepositoryType } from "./GQLTypes";
import type {
  ITrackedRepository,
  TrackedRepositoriesByOrg,
  TrackRepositoryArgs,
} from "./types";

export const trackRepository: GraphQLFieldConfig<
  ITrackedRepository,
  Context,
  TrackRepositoryArgs
> = {
  type: SchemaBuilder.nonNull(TrackedRepositoryType),
  args: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    description: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    language: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    api_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    html_url: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    platform: {
      type: SchemaBuilder.nonNull(PlatformType),
    },
  },
  resolve: (_, args) => {
    return TrackedRepositoriesController.track(args);
  },
};

export const trackedRepositories: GraphQLFieldConfig<
  ITrackedRepository,
  Context,
  TrackedRepositoriesByOrg
> = {
  type: SchemaBuilder.nonNullArray(TrackedRepositoryType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return TrackedRepositoriesController.list(args.organizationId);
  },
};
