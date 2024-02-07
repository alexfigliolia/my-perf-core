import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { BaseOrganizationAndUserRoles } from "Schema/Resolvers/Organization";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IBaseUser, IUserAndAffiliations } from "./types";

export const UserType = new GraphQLObjectType<IBaseUser, Context>({
  name: "User",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: user => user.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.name,
    },
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.email,
    },
    verified: {
      type: SchemaBuilder.nonNull(GraphQLBoolean),
      resolve: user => user.verified,
    },
  },
});

export const UserAndAffiliations = new GraphQLObjectType<
  IUserAndAffiliations,
  Context
>({
  name: "UserAndAffiliations",
  fields: {
    user: {
      type: SchemaBuilder.nonNull(UserType),
      resolve: aff => aff.user,
    },
    organizations: {
      type: SchemaBuilder.nonNullArray(BaseOrganizationAndUserRoles),
      resolve: aff => aff.organizations,
    },
  },
});
