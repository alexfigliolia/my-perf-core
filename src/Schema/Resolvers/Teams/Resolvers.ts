import {
  GraphQLBoolean,
  GraphQLError,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { Errors } from "Errors";
import type { IByOrganization } from "Schema/Resolvers/Organization/types";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { TeamsController } from "./Controller";
import { CurrentUsersTeamType, TeamType } from "./GQLTypes";
import type { ICreateTeam, ISearchTeams } from "./types";

export const teams: GraphQLFieldConfig<any, Context, ISearchTeams> = {
  type: SchemaBuilder.nonNullArray(TeamType),
  args: {
    limit: {
      type: GraphQLInt,
    },
    search: {
      type: GraphQLString,
    },
    offset: {
      type: GraphQLInt,
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    omitCurrentUser: {
      type: GraphQLBoolean,
    },
  },
  resolve: (_, args, context) => {
    const userId = context.req.session.userID;
    if (!userId) {
      throw new GraphQLError("Unauthorized", {
        extensions: Errors.UNAUTHORIZED,
      });
    }
    return TeamsController.list(args);
  },
};

export const myTeams: GraphQLFieldConfig<any, Context, IByOrganization> = {
  type: SchemaBuilder.nonNullArray(CurrentUsersTeamType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args, context) => {
    const { userID } = context.req.session;
    if (!userID) {
      throw new GraphQLError("Unauthorized");
    }
    return TeamsController.listUserTeams(userID, args.organizationId);
  },
};

export const createTeam: GraphQLFieldConfig<any, Context, ICreateTeam> = {
  type: SchemaBuilder.nonNull(CurrentUsersTeamType),
  args: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args, context) => {
    const { userID } = context.req.session;
    if (!userID) {
      throw new GraphQLError("Unauthorized");
    }
    return TeamsController.create(userID, args);
  },
};
