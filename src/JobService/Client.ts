import { Environment } from "Environment";
import { GQLClient } from "GQLClient";
import type { JobServiceOptions } from "./types";

export class JobServiceClient<
  D,
  V extends Record<string, any> = Record<string, any>,
> extends GQLClient<D, V> {
  constructor(options: JobServiceOptions<V>) {
    super({
      url: `${Environment.PULL_SERVICE_URL}/graphql`,
      ...options,
    });
  }
}
