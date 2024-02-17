import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLString,
} from "graphql";
import type { IGithubCode } from "Schema/Resolvers/Github";
import { UserType } from "Schema/Resolvers/User";
import type { Context, None } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { LoginController } from "./Controller";

export const loginWithGithub: GraphQLFieldConfig<any, Context, IGithubCode> = {
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
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  resolve: (_1, _2, context) => {
    return LoginController.verify(context.req);
  },
};

export const verifyAnonymous: GraphQLFieldConfig<any, Context, None> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  resolve: (_1, _2, context) => {
    return LoginController.verifyAnonymous(context.req);
  },
};

export const logout: GraphQLFieldConfig<any, Context, None> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  resolve: (_1, _2, context) => {
    LoginController.logout(context.req);
    return true;
  },
};
