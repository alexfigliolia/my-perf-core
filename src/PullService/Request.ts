import { PullServiceClient } from "./Client";
import type { PullServiceOptions } from "./types";

export const PullServiceRequest = <
  D,
  V extends Record<string, any> = Record<string, any>,
>(
  options: PullServiceOptions<V>,
) => {
  const client = new PullServiceClient<D, V>(options);
  return client.request();
};
