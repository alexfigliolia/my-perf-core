import {
  type GithubEventStream,
  type WebHookEvent,
  WebHooks,
} from "Github/API";
import type { Handler } from "./types";

export abstract class BaseHandler<T extends WebHookEvent> implements Handler {
  listeners: string[] = [];
  abstract readonly events: T[];

  public initialize() {
    if (this.listeners.length) {
      return this;
    }
    this.events.forEach(e => {
      const ID = WebHooks.Emitter.on(e, this.handler);
      this.listeners.push(ID);
    });
    return this;
  }

  public destroy() {
    this.listeners.forEach((ID, i) => {
      WebHooks.Emitter.off(this.events[i], ID);
    });
    this.listeners = [];
  }

  abstract handler(event: GithubEventStream[T]): void;
}
