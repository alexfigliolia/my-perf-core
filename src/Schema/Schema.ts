import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  createGithubAccount,
  installationSetup,
  listAvailableRepositories,
  listGithubInstallationRepositories,
  listGithubOrganizationRepositories,
  listGithubUserRepositories,
  loginWithGithub,
  logout,
  userAndAffiliations,
  verifyAnonymous,
  verifySession,
} from "./Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    installationSetup,
    userAndAffiliations,
    listAvailableRepositories,
    listGithubUserRepositories,
    listGithubInstallationRepositories,
    listGithubOrganizationRepositories,
  }),
});

const MutationRoot = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    logout,
    verifySession,
    verifyAnonymous,
    loginWithGithub,
    createGithubAccount,
  }),
});

const SubscriptionRoot = new GraphQLObjectType({
  name: "Subscription",
  fields: () => ({
    installationSetup,
  }),
});

export const Schema = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot,
  subscription: SubscriptionRoot,
});
