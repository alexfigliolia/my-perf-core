import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { JobStatus } from "GQL/AsyncService/Types";
import { AsyncController } from "Schema/Resolvers/AsyncJobs/Controller";
import type { IByOrganization } from "Schema/Resolvers/Organization/types";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { Subscriptions } from "Subscriptions";
import { RepositoryController } from "./Controller";
import {
  ProjectCountType,
  RepositorySortKeysType,
  RepositoryType,
} from "./GQLTypes";
import type {
  IAvailableRepositories,
  IByOptionalTeam,
  IByRepository,
  ITotalRepos,
} from "./types";

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
  subscribe: async (_, args) => {
    const subscription = Subscriptions.subscribe(
      "newRepositories",
      args.organizationId,
    );
    const status = await AsyncController.checkRepoPullStatus(
      args.organizationId,
    );
    if (status === JobStatus.Complete) {
      void RepositoryController.list(args).then(result => {
        if (result) {
          Subscriptions.publish("newRepositories", args.organizationId, result);
        }
      });
    }
    return subscription;
  },
  resolve: (_, args) => {
    return RepositoryController.list(args);
  },
};

export const trackedRepositories: GraphQLFieldConfig<
  any,
  Context,
  IByOptionalTeam
> = {
  type: SchemaBuilder.nonNullArray(RepositoryType),
  args: {
    teamId: {
      type: GraphQLInt,
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    if (typeof args.teamId === "number") {
      return RepositoryController.trackedRepositoriesByTeam(args.teamId);
    }
    return RepositoryController.trackedRepositoriesByOrganization(
      args.organizationId,
    );
  },
};

export const trackRepository: GraphQLFieldConfig<any, Context, IByRepository> =
  {
    type: SchemaBuilder.nonNull(RepositoryType),
    args: {
      teamId: {
        type: SchemaBuilder.nonNull(GraphQLInt),
      },
      repositoryId: {
        type: SchemaBuilder.nonNull(GraphQLInt),
      },
      organizationId: {
        type: SchemaBuilder.nonNull(GraphQLInt),
      },
    },
    resolve: (_, args, context) => {
      return RepositoryController.trackRepository(args, context.req.session);
    },
  };

export const totalRepositories: GraphQLFieldConfig<any, Context, ITotalRepos> =
  {
    type: SchemaBuilder.nonNull(GraphQLInt),
    args: {
      organizationId: {
        type: SchemaBuilder.nonNull(GraphQLInt),
      },
      tracked: {
        type: GraphQLBoolean,
      },
    },
    resolve: (_, args) => {
      return RepositoryController.count(args);
    },
  };

export const countLinesAndCommits: GraphQLFieldConfig<
  any,
  Context,
  IByOrganization
> = {
  type: SchemaBuilder.nonNull(ProjectCountType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args) => {
    return RepositoryController.countLinesAndCommits(args.organizationId);
  },
};
