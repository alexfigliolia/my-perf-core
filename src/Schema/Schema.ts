import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  createUserFromGithubInstallation,
  githubOrganizationSetup,
  listAvailableRepositories,
  loginWithGithub,
  logout,
  verifyAnonymous,
  verifySession,
} from "./Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    githubOrganizationSetup,
    listAvailableRepositories,
  }),
});

const MutationRoot = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    logout,
    verifySession,
    verifyAnonymous,
    loginWithGithub,
    createUserFromGithubInstallation,
  }),
});

const SubscriptionRoot = new GraphQLObjectType({
  name: "Subscription",
  fields: () => ({
    githubOrganizationSetup,
  }),
});

export const Schema = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot,
  subscription: SubscriptionRoot,
});
