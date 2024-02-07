import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { login, logout, onboard, verifySession } from "./Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    hello: {
      type: GraphQLString,
      resolve: () => "Hello",
    },
  }),
});

const MutationRoot = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    login,
    logout,
    onboard,
    verifySession,
  }),
});

export const Schema = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot,
});
