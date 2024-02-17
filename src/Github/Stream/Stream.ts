import type { EventEmitter } from "@figliolia/event-emitter";
import type { GithubEventStream } from "Github/API";
import type { Handler, IHandler } from "./Handlers";
import { Installations } from "./Handlers";

export class Stream {
  private Listeners: Handler[];
  private Emitter: EventEmitter<GithubEventStream>;
  private static readonly DefaultListeners: IHandler[] = [Installations];
  constructor(Emitter: EventEmitter<GithubEventStream>) {
    this.Emitter = Emitter;
    this.Listeners = Stream.DefaultListeners.map(L => {
      const H = new L(Emitter);
      H.initialize();
      return H;
    });
  }

  public subscribe<E extends keyof GithubEventStream>(
    event: E,
    callback: (payload: GithubEventStream[E]) => void,
  ) {
    return this.Emitter.on(event, callback);
  }

  public unsubscribe<E extends keyof GithubEventStream>(event: E, ID: string) {
    return this.Emitter.off(event, ID);
  }

  public destroy() {
    this.Listeners.forEach(L => L.destroy());
  }
}
