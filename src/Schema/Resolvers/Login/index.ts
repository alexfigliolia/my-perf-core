import { type GraphQLFieldConfig, GraphQLString } from "graphql";
import { UserType } from "Schema/Resolvers/User";
import { SchemaBuilder } from "Schema/Utilities";
import { Controller } from "./Controller";
import type { ILogin } from "./types";

export const login: GraphQLFieldConfig<any, any, ILogin> = {
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
    const user = await Controller.login(args);
    context.req.session.userID = user.id;
    context.req.session.username = user.name;
    context.req.session.password = user.password;
    return user;
  },
};
