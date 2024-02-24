import { Environment } from "Environment";
import { GQLClient } from "GQL/Client";
import type { PullServiceOptions } from "./types";

export class PullServiceClient<
  D,
  V extends Record<string, any> = Record<string, any>,
> extends GQLClient<D, V> {
  constructor(options: PullServiceOptions<V>) {
    super({
      url: `${Environment.PULL_SERVICE_URL}/graphql`,
      ...options,
    });
  }
}
