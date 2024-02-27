import { GQLClient } from "@figliolia/graphql-client";
import { Environment } from "Environment";
import type { AsyncServiceOptions } from "./types";

export class AsyncServiceClient<
  D,
  V extends Record<string, any> = Record<string, any>,
> extends GQLClient<D, V> {
  constructor(options: AsyncServiceOptions<V>) {
    super({
      url: `${Environment.ASYNC_SERVICE_URL}/graphql`,
      ...options,
    });
  }
}
