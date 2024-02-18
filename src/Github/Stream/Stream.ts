import { type GithubEventStream, WebHooks } from "Github/API";
import { Installations } from "./Handlers";

export class Stream {
  private static readonly DefaultListeners = [Installations];
  private static Listeners = this.DefaultListeners.map(L => {
    return new L().initialize();
  });

  public static subscribe<E extends keyof GithubEventStream>(
    event: E,
    callback: (payload: GithubEventStream[E]) => void,
  ) {
    return WebHooks.Emitter.on(event, callback);
  }

  public static unsubscribe<E extends keyof GithubEventStream>(
    event: E,
    ID: string,
  ) {
    return WebHooks.Emitter.off(event, ID);
  }

  public static destroy() {
    this.Listeners.forEach(L => L.destroy());
  }
}
