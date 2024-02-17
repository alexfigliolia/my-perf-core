import type { GraphQLFieldConfig } from "graphql";
import { GraphQLInt } from "graphql";
import { PlatformType } from "Schema/Resolvers/Platform/GQLTypes";
import type { Context } from "Schema/Utilities";
import { SchemaBuilder } from "Schema/Utilities";
import { Subscriptions } from "Subscriptions";
import { InstallationController } from "./Controller";
import { InstallationType } from "./GQLTypes";
import type { ICreateInstallation } from "./types";

export const installationSetup: GraphQLFieldConfig<
  any,
  Context,
  ICreateInstallation
> = {
  type: SchemaBuilder.nonNull(InstallationType),
  args: {
    platform: {
      type: SchemaBuilder.nonNull(PlatformType),
    },
    installation_id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  subscribe: (_, { installation_id, platform }) => {
    const key = InstallationController.broadcastKey(installation_id, platform);
    const subscription = Subscriptions.subscribe("newInstallation", key);
    void InstallationController.emitLast(installation_id, platform);
    return subscription;
  },
  resolve: (_, { installation_id, platform }) => {
    return InstallationController.find(installation_id, platform);
  },
};
