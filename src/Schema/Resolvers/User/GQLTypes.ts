import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { GithubUserAuthorizationType } from "Schema/Resolvers/Github/GQLTypes";
import { OrgAffiliationType } from "Schema/Resolvers/Organization/GQLTypes";
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
  },
});

export const UserAndAffiliationsType = new GraphQLObjectType<
  IUserAndAffiliations,
  Context
>({
  name: "UserAndAffiliations",
  fields: {
    ...UserType.toConfig().fields,
    organizations: {
      type: SchemaBuilder.nonNullArray(OrgAffiliationType),
      resolve: user => user.organizations,
    },
    github: {
      type: GithubUserAuthorizationType,
      resolve: user => user.github,
    },
  },
});
