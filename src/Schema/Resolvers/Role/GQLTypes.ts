import { GraphQLEnumType, GraphQLObjectType } from "graphql";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import type { IBaseRole } from "./types";

export const UserRole = new GraphQLEnumType({
  name: "UserRole",
  values: {
    admin: {
      value: "admin",
    },
    manager: {
      value: "manager",
    },
    viewer: {
      value: "viewer",
    },
  },
});

export const RoleType = new GraphQLObjectType<IBaseRole, Context>({
  name: "RoleType",
  fields: {
    role: {
      type: SchemaBuilder.nonNull(UserRole),
      resolve: role => role.role,
    },
  },
});
