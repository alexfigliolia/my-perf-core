import { StatsServiceClient } from "./Client";
import type { PullServiceOptions } from "./types";

export const StatsServiceRequest = <
  D,
  V extends Record<string, any> = Record<string, any>,
>(
  options: PullServiceOptions<V>,
) => {
  const client = new StatsServiceClient<D, V>(options);
  return client.request();
};
