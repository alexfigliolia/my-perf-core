import { GQLClient } from "@figliolia/graphql-client";
import { Environment } from "Environment";
import type { StatsServiceOptions } from "./types";

export class StatsServiceClient<
  D,
  V extends Record<string, any> = Record<string, any>,
> extends GQLClient<D, V> {
  constructor(options: StatsServiceOptions<V>) {
    super({
      url: `${Environment.STATS_SERVICE_URL}/graphql`,
      ...options,
    });
  }
}
