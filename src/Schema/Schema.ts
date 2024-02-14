import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  createOrganization,
  listAvailableRepositories,
  logout,
  onboardWithGithub,
  verifyAnonymous,
  verifySession,
} from "./Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    listAvailableRepositories,
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
