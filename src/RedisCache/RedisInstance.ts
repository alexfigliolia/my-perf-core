import { createClient } from "redis";
import { Environment } from "Environment";
import { Logger } from "Logger";

export class RedisCache {
  public static Client = createClient({
    url: Environment.REDIS_URL,
  });

  public static async start() {
    this.bindListeners();
    await this.Client.connect();
    await this.Client.ping();
  }

  public static close() {
    this.Client.off("error", this.onError);
    this.Client.off("connect", this.onConnection);
    return this.Client.quit();
  }

  private static bindListeners() {
    this.Client.on("error", this.onError);
    this.Client.on("connect", this.onConnection);
  }

  private static onConnection = () => {
    Logger.redis("Connected to redis successfully");
  };

  private static onError = (error: any) => {
    Logger.redis("Could not establish a connection with redis", error);
  };
}
