import { StatsServiceClient } from "./Client";
import type { AsyncServiceOptions } from "./types";

export const StatsServiceRequest = <
  D,
  V extends Record<string, any> = Record<string, any>,
>(
  options: AsyncServiceOptions<V>,
) => {
  const client = new StatsServiceClient<D, V>(options);
  return client.request();
};
