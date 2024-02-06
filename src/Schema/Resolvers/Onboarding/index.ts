import {
  GraphQLEnumType,
  type GraphQLFieldConfig,
  GraphQLString,
} from "graphql";
import { UserType } from "Schema/Resolvers/User";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { Controller } from "./Controller";
import type { IOnBoard } from "./types";

export const Platform = new GraphQLEnumType({
  name: "Platform",
  values: {
    github: {
      value: "github",
    },
    bitbucket: {
      value: "bitbucket",
    },
  },
});

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
    platform: {
      type: SchemaBuilder.nonNull(Platform),
    },
    organizationName: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_, args, context) => {
    const user = await Controller.onboard(args);
    context.req.session.userID = user.id;
    context.req.session.email = user.email;
    return user;
  },
};
