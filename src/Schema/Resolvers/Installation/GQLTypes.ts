import { GraphQLInt, GraphQLObjectType } from "graphql";
import { PlatformType } from "Schema/Resolvers/Platform/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IInstallation } from "./types";

export const InstallationType = new GraphQLObjectType<IInstallation, Context>({
  name: "InstallationType",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: installation => installation.id,
    },
    installation_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: installation => installation.id,
    },
    platform: {
      type: SchemaBuilder.nonNull(PlatformType),
      resolve: installation => installation.platform,
    },
    organizationId: {
      type: GraphQLInt,
      resolve: installation => installation.organizationId,
    },
  },
});
