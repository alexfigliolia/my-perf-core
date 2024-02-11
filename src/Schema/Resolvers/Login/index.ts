import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLString,
} from "graphql";
import { UserAndAffiliations, UserType } from "Schema/Resolvers/User";
import type { Context, None } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { LoginController } from "./Controller";
import type { ILogin } from "./types";

export const login: GraphQLFieldConfig<any, Context, ILogin> = {
  type: SchemaBuilder.nonNull(UserType),
  args: {
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    password: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_, args, context) => {
    const user = await LoginController.login(args);
    context.req.session.userID = user.id;
    context.req.session.email = user.email;
    return user;
  },
};

export const verifySession: GraphQLFieldConfig<any, Context, None> = {
  type: SchemaBuilder.nonNull(UserAndAffiliations),
  resolve: async (_1, _2, context) => {
    const result = await LoginController.verify(context.req);
    context.req.session.userID = result.user.id;
    context.req.session.email = result.user.email;
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
