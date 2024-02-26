import { StatsServiceClient } from "./Client";
import type { StatsServiceOptions } from "./types";

export const StatsServiceRequest = <
  D,
  V extends Record<string, any> = Record<string, any>,
>(
  options: StatsServiceOptions<V>,
) => {
  const client = new StatsServiceClient<D, V>(options);
  return client.request();
};
