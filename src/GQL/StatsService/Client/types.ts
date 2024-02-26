import type { IGQLRequest } from "GQL/Client";

export type StatsServiceOptions<
  V extends Record<string, any> = Record<string, any>,
> = Omit<IGQLRequest<V>, "url">;
