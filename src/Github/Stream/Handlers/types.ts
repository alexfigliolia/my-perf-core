import type { WebHookEvent } from "Github/API";

export interface Handler {
  listeners: string[];
  events: WebHookEvent[];
  initialize: () => Handler;
  destroy: () => void;
}
