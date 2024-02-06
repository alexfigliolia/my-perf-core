import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { SchemaBuilder } from "Schema/Utilities";

export const UserType = new GraphQLObjectType({
  name: "user",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: user => user.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.name,
    },
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.email,
    },
    image: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.image,
    },
    verified: {
      type: SchemaBuilder.nonNull(GraphQLBoolean),
      resolve: user => user.verified,
    },
  },
});
