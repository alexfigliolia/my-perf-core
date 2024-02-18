import { GraphQLEnumType, GraphQLInt, GraphQLObjectType } from "graphql";
import { PlatformType } from "Schema/Resolvers/Platform/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IInstallation } from "./types";

export const InstallationTypeEnum = new GraphQLEnumType({
  name: "InstallationType",
  values: {
    organization: {
      value: "organization",
    },
    individual: {
      value: "individual",
    },
  },
});

export const InstallationType = new GraphQLObjectType<IInstallation, Context>({
  name: "Installation",
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
    type: {
      type: SchemaBuilder.nonNull(InstallationTypeEnum),
      resolve: installation => installation.type,
    },
  },
});
