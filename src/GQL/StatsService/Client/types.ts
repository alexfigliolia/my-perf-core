import type { IGQLRequest } from "@figliolia/graphql-client";

export type StatsServiceOptions<
  V extends Record<string, any> = Record<string, any>,
> = Omit<IGQLRequest<V>, "url">;
