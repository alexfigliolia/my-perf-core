import type { GraphQLFieldConfig } from "graphql";
import { GraphQLError, GraphQLInt, GraphQLString } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import { UserRole } from "Schema/Resolvers/Role/GQLTypes";
import { TeamController } from "Schema/Resolvers/Team/Controller";
import { TeamStatsType } from "Schema/Resolvers/Team/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { UserController } from "./Controller";
import { UserAndAffiliationsType } from "./GQLTypes";
import type { IAddNewUserToTeam } from "./types";

export const userAndAffiliations: GraphQLFieldConfig<
  any,
  Context,
  Record<string, never>
> = {
  type: SchemaBuilder.nonNull(UserAndAffiliationsType),
  resolve: (_1, _2, context) => {
    const { userID } = context.req.session;
    if (!userID) {
      throw new GraphQLError("Unauthorized", {
        extensions: Errors.UNAUTHORIZED,
      });
    }
    return UserController.userScopeQuery(userID);
  },
};

export const addNewUserToTeam: GraphQLFieldConfig<
  any,
  Context,
  IAddNewUserToTeam
> = {
  type: SchemaBuilder.nonNull(TeamStatsType),
  args: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    role: {
      type: SchemaBuilder.nonNull(UserRole),
    },
    teamId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: async (_, args) => {
    await UserController.addNewUserToTeam(args);
    return TeamController.overallStatsPerUser({
      teamId: args.teamId,
      organizationId: args.organizationId,
    });
  },
};
