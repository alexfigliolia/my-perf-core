import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import {
  createOrganization,
  logout,
  onboardWithGithub,
  verifyAnonymous,
  verifySession,
} from "./Resolvers";

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
    logout,
    verifySession,
    verifyAnonymous,
    createOrganization,
    onboardWithGithub,
  }),
});

export const Schema = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot,
});
