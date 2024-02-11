import GenericProxy from "smee-client";
import { Logger } from "Logger";

export class WebHookProxy {
  private static Client?: GenericProxy;

  public static start() {
    this.Client = new GenericProxy({
      source: "https://smee.io/OXJxBqKR99KtZxY",
      target: "https://localhost:4000/github/events",
      logger: {
        error: Logger.proxy,
        info: Logger.proxy,
      },
    });
    this.Client.start();
  }

  public static stop() {
    this.Client?.events.close();
  }
}
