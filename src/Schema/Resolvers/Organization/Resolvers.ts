import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { Platform } from "Schema/Resolvers/Platform";
import { RoleType } from "Schema/Resolvers/Role";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IOrgAffiliation, IOrganization } from "./types";

export const OrgAffiliationType = new GraphQLObjectType<
  IOrgAffiliation,
  Context
>({
  name: "OrgAffiliationType",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: org => org.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: org => org.name,
    },
    roles: {
      type: SchemaBuilder.nonNullArray(RoleType),
      resolve: org => org.roles,
    },
    platform: {
      type: SchemaBuilder.nonNull(Platform),
      resolve: org => org.platform,
    },
  },
});

export const OrganizationType = new GraphQLObjectType<IOrganization, Context>({
  name: "OrganizationType",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: org => org.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: org => org.name,
    },
    installation_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: org => org.installation_id,
    },
    platform: {
      type: SchemaBuilder.nonNull(Platform),
      resolve: org => org.platform,
    },
  },
});
