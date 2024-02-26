import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  createGithubAccount,
  installationSetup,
  loginWithGithub,
  logout,
  setOrganizationRepositories,
  userAndAffiliations,
  verifyAnonymous,
  verifySession,
} from "./Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    installationSetup,
    userAndAffiliations,
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
    setOrganizationRepositories,
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
