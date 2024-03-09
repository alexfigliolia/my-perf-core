import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { TrackedRepositoryType } from "Schema/Resolvers/Repositories/GQLTypes";
import { RoleType } from "Schema/Resolvers/Role/GQLTypes";
import { UserType } from "Schema/Resolvers/User/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { ITeam } from "./types";

export const TeamType = new GraphQLObjectType<ITeam, Context>({
  name: "Team",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: team => team.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: team => team.name,
    },
    users: {
      type: SchemaBuilder.nonNullArray(UserType),
      resolve: team => team.users,
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: team => team.organizationId,
    },
    projects: {
      type: SchemaBuilder.nonNullArray(TrackedRepositoryType),
      resolve: team => team.projects,
    },
  },
});

export const CurrentUsersTeamType = new GraphQLObjectType<ITeam, Context>({
  name: "CurrentUsersTeam",
  fields: {
    ...TeamType.toConfig().fields,
    role: {
      type: SchemaBuilder.nonNull(RoleType),
      resolve: team => team.role,
    },
  },
});
