import type { GraphQLFieldConfig } from "graphql";
import { GraphQLInt, GraphQLString } from "graphql";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { RepositoryController } from "./Controller";
import { AvailableRepositoryType } from "./GQLTypes";
import type { IRepositoryQuery } from "./types";

export const listAvailableRepositories: GraphQLFieldConfig<
  any,
  Context,
  IRepositoryQuery
> = {
  type: SchemaBuilder.nonNullArray(AvailableRepositoryType),
  args: {
    offset: {
      type: GraphQLInt,
    },
    limit: {
      type: GraphQLInt,
    },
    sort: {
      type: GraphQLString,
      description:
        'A key of the Available Repository Type. Defaults to "updated_at"',
    },
    search: {
      type: GraphQLString,
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: async (_, args) => {
    return RepositoryController.getAvailableRepositories(args);
  },
};
