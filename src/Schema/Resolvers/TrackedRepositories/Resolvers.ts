import { type GraphQLFieldConfig, GraphQLInt } from "graphql";
import type { Context } from "vm";
import { AvailableRepositoryType } from "Schema/Resolvers/Repositories/GQLTypes";
import type { IAvailableRepository } from "Schema/Resolvers/Repositories/types";
import { SchemaBuilder } from "Schema/Utilities";
import { TrackedRepositoriesController } from "./Controller";
import type { ITrackRepository, TrackedRepositoriesByOrg } from "./types";

export const trackRepository: GraphQLFieldConfig<
  IAvailableRepository,
  Context,
  ITrackRepository
> = {
  type: SchemaBuilder.nonNull(AvailableRepositoryType),
  args: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return TrackedRepositoriesController.track(args);
  },
};

export const trackedRepositories: GraphQLFieldConfig<
  IAvailableRepository,
  Context,
  TrackedRepositoriesByOrg
> = {
  type: SchemaBuilder.nonNullArray(AvailableRepositoryType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return TrackedRepositoriesController.list(args.organizationId);
  },
};
