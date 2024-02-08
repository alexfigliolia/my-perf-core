import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { UserRole } from "Schema/Resolvers/Role";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IBaseOrganization, IBaseOrganizationWithUserRole } from "./types";

export const BaseOrganizationType = new GraphQLObjectType<
  IBaseOrganization,
  Context
>({
  name: "BaseOrganizationType",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: org => org.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: org => org.name,
    },
  },
});

export const BaseOrganizationAndUserRole = new GraphQLObjectType<
  IBaseOrganizationWithUserRole,
  Context
>({
  name: "BaseOrganizationAndUserRole",
  fields: {
    ...BaseOrganizationType.toConfig().fields,
    role: {
      type: SchemaBuilder.nonNull(UserRole),
      resolve: org => org.role,
    },
  },
});
