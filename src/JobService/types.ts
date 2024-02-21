import type { IGQLRequest } from "GQLClient/Client";

export type JobServiceOptions<
  V extends Record<string, any> = Record<string, any>,
> = Omit<IGQLRequest<V>, "url">;
