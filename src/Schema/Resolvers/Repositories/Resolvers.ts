import type { GraphQLFieldConfig } from "graphql";
import { GraphQLError, GraphQLInt, GraphQLString } from "graphql";
import { Errors } from "Errors";
import type { ListRepositoryQuery } from "Github/API";
import { Repositories } from "Github/API";
import { InstallationController } from "Schema/Resolvers/Installation/Controller";
import { InstallationTypeEnum } from "Schema/Resolvers/Installation/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { GithubRepository } from "./GQLTypes";
import type {
  IAvailableRepositories,
  IInstallationRepositories,
  IOrganizationRepositories,
} from "./types";

export const listGithubUserRepositories: GraphQLFieldConfig<
  any,
  Context,
  ListRepositoryQuery
> = {
  type: SchemaBuilder.nonNullArray(GithubRepository),
  args: {
    sort: {
      type: GraphQLString,
    },
    page: {
      type: GraphQLString,
    },
  },
  resolve: (_, args, context) => {
    const token = context.req.session.githubUserToken;
    if (!token) {
      throw new GraphQLError("Unauthorized", {
        extensions: Errors.UNAUTHORIZED,
      });
    }
    return Repositories.listUserRepositories(token, args);
  },
};

export const listGithubInstallationRepositories: GraphQLFieldConfig<
  any,
  Context,
  IInstallationRepositories
> = {
  type: SchemaBuilder.nonNullArray(GithubRepository),
  args: {
    page: {
      type: GraphQLString,
    },
    installation_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: async (_, { page, installation_id }) => {
    const token = await InstallationController.currentToken(installation_id);
    return Repositories.listInstallationRepositories(token, page);
  },
};

export const listGithubOrganizationRepositories: GraphQLFieldConfig<
  any,
  Context,
  IOrganizationRepositories
> = {
  type: SchemaBuilder.nonNullArray(GithubRepository),
  args: {
    page: {
      type: GraphQLString,
    },
    installation_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    sort: {
      type: GraphQLString,
    },
    organization_name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_, { installation_id, ...rest }) => {
    const token = await InstallationController.currentToken(installation_id);
    return Repositories.listOrganizationRepositories(token, rest);
  },
};

export const listAvailableRepositories: GraphQLFieldConfig<
  any,
  Context,
  IAvailableRepositories
> = {
  type: SchemaBuilder.nonNullArray(GithubRepository),
  args: {
    page: {
      type: GraphQLString,
    },
    type: {
      type: SchemaBuilder.nonNull(InstallationTypeEnum),
    },
    installation_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    sort: {
      type: GraphQLString,
    },
    organization_name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (
    _,
    { organization_name, type, installation_id, page, sort },
    context,
  ) => {
    if (type === "individual") {
      return Repositories.listUserRepositories(
        context.req.session.githubUserToken || "",
        { page, sort },
      );
    }
    const token = await InstallationController.currentToken(installation_id);
    return Repositories.listOrganizationRepositories(token, {
      page,
      sort,
      organization_name,
    });
  },
};
