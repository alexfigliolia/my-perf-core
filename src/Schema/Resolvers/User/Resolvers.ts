import type { GraphQLFieldConfig } from "graphql";
import {
  GraphQLError,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { Errors } from "Errors";
import { GithubAuthorizationType } from "Schema/Resolvers/Github";
import { OrgAffiliationType } from "Schema/Resolvers/Organization";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { UserController } from "./Controller";
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
    organization: {
      type: SchemaBuilder.nonNullArray(OrgAffiliationType),
      resolve: user => user.organization,
    },
    github: {
      type: GithubAuthorizationType,
      resolve: user => user.github,
    },
  },
});

export const userAndAffiliations: GraphQLFieldConfig<
  any,
  Context,
  { userId: number }
> = {
  type: SchemaBuilder.nonNull(UserAndAffiliationsType),
  resolve: (_1, _2, context) => {
    const { userID } = context.req.session;
    if (!userID) {
      throw new GraphQLError("Unauthorized", {
        extensions: Errors.UNAUTHORIZED,
      });
    }
    return UserController.userScopeQuery(userID);
  },
};
