import { Environment } from "Environment";
import { GQLClient } from "GQL/Client";
import type { AsyncServiceOptions } from "./types";

export class AsyncServiceClient<
  D,
  V extends Record<string, any> = Record<string, any>,
> extends GQLClient<D, V> {
  constructor(options: AsyncServiceOptions<V>) {
    super({
      url: `${Environment.PULL_SERVICE_URL}/graphql`,
      ...options,
    });
  }
}
