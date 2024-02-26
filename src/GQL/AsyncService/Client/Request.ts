import { AsyncServiceClient } from "./Client";
import type { AsyncServiceOptions } from "./types";

export const AsyncServiceRequest = <
  D,
  V extends Record<string, any> = Record<string, any>,
>(
  options: AsyncServiceOptions<V>,
) => {
  const client = new AsyncServiceClient<D, V>(options);
  return client.request();
};
