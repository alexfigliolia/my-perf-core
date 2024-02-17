import type { GraphQLFieldConfig } from "graphql";
import { GraphQLError } from "graphql";
import { Errors } from "Errors";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { UserController } from "./Controller";
import { UserAndAffiliationsType } from "./GQLTypes";

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
