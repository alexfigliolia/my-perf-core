import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  availableRepositories,
  availableRepositoriesStream,
  createGithubAccount,
  installationSetup,
  installationSetupStream,
  loginWithGithub,
  logout,
  setOrganizationRepositories,
  trackedRepositories,
  trackRepository,
  userAndAffiliations,
  verifyAnonymous,
  verifySession,
} from "./Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    installationSetup,
    userAndAffiliations,
    trackedRepositories,
    availableRepositories,
  }),
});

const MutationRoot = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    logout,
    verifySession,
    verifyAnonymous,
    loginWithGithub,
    trackRepository,
    createGithubAccount,
    setOrganizationRepositories,
  }),
});

const SubscriptionRoot = new GraphQLObjectType({
  name: "Subscription",
  fields: () => ({
    installationSetupStream,
    availableRepositoriesStream,
  }),
});

export const Schema = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot,
  subscription: SubscriptionRoot,
});
