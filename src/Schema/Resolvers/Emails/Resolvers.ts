import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import type { Context } from "vm";
import { SchemaBuilder } from "Schema/Utilities";
import type { IEmail } from "./types";

export const EmailType = new GraphQLObjectType<IEmail, Context>({
  name: "Email",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: email => email.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: email => email.name,
    },
    verified: {
      type: SchemaBuilder.nonNull(GraphQLBoolean),
      resolve: email => email.verified,
    },
    primary: {
      type: SchemaBuilder.nonNull(GraphQLBoolean),
      resolve: email => email.primary,
    },
    userId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: email => email.userId,
    },
  },
});
