import { type GraphQLFieldConfig, GraphQLString } from "graphql";
import { UserType } from "Schema/Resolvers/User";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { Controller } from "./Controller";
import type { IOnboardWithGithub } from "./types";

export const onboardWithGithub: GraphQLFieldConfig<
  any,
  Context,
  IOnboardWithGithub
> = {
  type: SchemaBuilder.nonNull(UserType),
  args: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    code: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_, args, context) => {
    const user = await Controller.onboardWithGithub(args);
    context.req.session.userID = user.id;
    context.req.session.email = user.email;
    return user;
  },
};
