import { type GraphQLFieldConfig, GraphQLString } from "graphql";
import { Platform } from "Schema/Resolvers/Platform";
import { UserAndAffiliations } from "Schema/Resolvers/User";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { OnboardController } from "./Controller";
import type { IOnBoard } from "./types";

export const onboard: GraphQLFieldConfig<any, Context, IOnBoard> = {
  type: SchemaBuilder.nonNull(UserAndAffiliations),
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
    platform: {
      type: SchemaBuilder.nonNull(Platform),
    },
    organizationName: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_, args, context) => {
    const result = await OnboardController.onboard(args);
    context.req.session.userID = result.user.id;
    context.req.session.email = result.user.email;
    return result;
  },
};
