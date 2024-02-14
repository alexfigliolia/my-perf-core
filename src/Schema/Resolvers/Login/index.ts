import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLString,
} from "graphql";
import type { GithubCode } from "Schema/Resolvers/Github/types";
import { UserAndAffiliations, UserType } from "Schema/Resolvers/User";
import type { Context, None } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { LoginController } from "./Controller";

export const loginWithGithub: GraphQLFieldConfig<any, Context, GithubCode> = {
  type: SchemaBuilder.nonNull(UserType),
  args: {
    code: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_1, args, context) => {
    const user = await LoginController.loginWithGithub(args.code);
    context.req.session.userID = user.id;
    return user;
  },
};

export const verifySession: GraphQLFieldConfig<any, Context, None> = {
  type: SchemaBuilder.nonNull(UserAndAffiliations),
  resolve: async (_1, _2, context) => {
    const result = await LoginController.verify(context.req);
    context.req.session.userID = result.user.id;
    return result;
  },
};

export const verifyAnonymous: GraphQLFieldConfig<any, Context, None> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  resolve: (_1, _2, context) => {
    if (context.req.session.userID) {
      return false;
    }
    return true;
  },
};

export const logout: GraphQLFieldConfig<any, Context, None> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  resolve: (_1, _2, context) => {
    LoginController.logout(context.req);
    return true;
  },
};
