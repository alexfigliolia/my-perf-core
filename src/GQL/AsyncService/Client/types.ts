import type { IGQLRequest } from "GQL/Client";

export type AsyncServiceOptions<
  V extends Record<string, any> = Record<string, any>,
> = Omit<IGQLRequest<V>, "url">;
