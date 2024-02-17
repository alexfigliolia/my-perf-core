import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { InstallationType } from "Schema/Resolvers/Installation/GQLTypes";
import { RoleType } from "Schema/Resolvers/Role/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IOrgAffiliation } from "./types";

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
    installations: {
      type: SchemaBuilder.nonNullArray(InstallationType),
      resolve: org => org.installations,
    },
  },
});
