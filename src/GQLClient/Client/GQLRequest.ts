import { GQLClient } from "./GQLClient";
import type { IGQLRequest } from "./types";

export const GQLRequest = <
  D,
  V extends Record<string, any> = Record<string, any>,
>(
  params: IGQLRequest<V>,
) => {
  const client = new GQLClient<D, V>(params);
  return client.request();
};
