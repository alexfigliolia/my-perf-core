import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { GithubUser } from "Schema/Resolvers/Github";
import { BaseOrganizationAndUserRole } from "Schema/Resolvers/Organization";
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
    github: {
      type: GithubUser,
      resolve: user => user.github,
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
      type: SchemaBuilder.nonNullArray(BaseOrganizationAndUserRole),
      resolve: aff => aff.organizations,
    },
  },
});
