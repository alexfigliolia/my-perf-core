import { JobServiceClient } from "./Client";
import type { JobServiceOptions } from "./types";

export const JobServiceRequest = <
  D,
  V extends Record<string, any> = Record<string, any>,
>(
  options: JobServiceOptions<V>,
) => {
  const client = new JobServiceClient<D, V>(options);
  return client.request();
};
