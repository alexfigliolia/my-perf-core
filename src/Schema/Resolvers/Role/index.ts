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
    engineer: {
      value: "engineer",
    },
    viewer: {
      value: "viewer",
    },
  },
});

export const BaseRoleType = new GraphQLObjectType<IBaseRole, Context>({
  name: "BaseRoleType",
  fields: {
    type: {
      type: SchemaBuilder.nonNull(UserRole),
      resolve: role => role.type,
    },
  },
});
