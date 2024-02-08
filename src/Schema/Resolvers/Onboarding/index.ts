import { type GraphQLFieldConfig, GraphQLString } from "graphql";
import { UserType } from "Schema/Resolvers/User";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { OnboardController } from "./Controller";
import type { IOnBoard } from "./types";

export const onboard: GraphQLFieldConfig<any, Context, IOnBoard> = {
  type: SchemaBuilder.nonNull(UserType),
  args: {
    username: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    password: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    organizationName: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_, args, context) => {
    const user = await OnboardController.onboard(args);
    context.req.session.userID = user.id;
    context.req.session.email = user.email;
    return user;
  },
};
