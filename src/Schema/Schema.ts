import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  availableRepositories,
  availableRepositoriesStream,
  createGithubAccount,
  createTeam,
  installationSetup,
  installationSetupStream,
  loginWithGithub,
  logout,
  myTeams,
  overallStatsPerUser,
  setOrganizationRepositories,
  setRepositoryStats,
  standouts,
  teams,
  trackedRepositories,
  trackRepository,
  userAndAffiliations,
  verifyAnonymous,
  verifySession,
} from "./Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    teams,
    myTeams,
    standouts,
    installationSetup,
    userAndAffiliations,
    trackedRepositories,
    availableRepositories,
    overallStatsPerUser,
  }),
});

const MutationRoot = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    logout,
    createTeam,
    verifySession,
    verifyAnonymous,
    loginWithGithub,
    trackRepository,
    createGithubAccount,
    setRepositoryStats,
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
