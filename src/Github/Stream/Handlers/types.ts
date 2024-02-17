import type { EventEmitter } from "@figliolia/event-emitter";
import type { GithubEventStream, WebHookEvent } from "Github/API";

export interface Handler {
  listeners: string[];
  events: WebHookEvent[];
  Emitter: EventEmitter<GithubEventStream>;
  initialize: () => void;
  destroy: () => void;
}

export type IHandler = new (
  Emitter: EventEmitter<GithubEventStream>,
) => Handler;

export type HandlerArgs = ConstructorParameters<IHandler>;
