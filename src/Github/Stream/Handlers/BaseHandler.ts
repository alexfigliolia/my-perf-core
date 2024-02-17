import type { EventEmitter } from "@figliolia/event-emitter";
import type { GithubEventStream, WebHookEvent } from "Github/API";
import type { Handler } from "./types";

export abstract class BaseHandler<T extends WebHookEvent> implements Handler {
  listeners: string[] = [];
  abstract readonly events: T[];
  readonly Emitter: EventEmitter<GithubEventStream>;
  constructor(Emitter: EventEmitter<GithubEventStream>) {
    this.Emitter = Emitter;
  }

  public initialize() {
    if (this.listeners.length) {
      return;
    }
    this.events.forEach(e => {
      const ID = this.Emitter.on(e, this.handler);
      this.listeners.push(ID);
    });
  }

  public destroy() {
    this.listeners.forEach((ID, i) => {
      this.Emitter.off(this.events[i], ID);
    });
    this.listeners = [];
  }

  abstract handler(event: GithubEventStream[T]): void;
}
