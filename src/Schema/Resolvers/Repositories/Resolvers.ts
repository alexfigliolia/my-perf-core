import { GraphQLBoolean, type GraphQLFieldConfig } from "graphql";
import { type Context, SchemaBuilder } from "Schema/Utilities";
import { RepositoryController } from "./Controller";
import { InputRepositoryType } from "./GQLTypes";
import type { ISetRepositories } from "./types";

export const setOrganizationRepositories: GraphQLFieldConfig<
  boolean,
  Context,
  ISetRepositories
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    repositories: {
      type: SchemaBuilder.nonNullArray(InputRepositoryType),
    },
  },
  resolve: (_, args) => {
    return RepositoryController.saveRepositories(args.repositories);
  },
};
