import { type Server as HTTP1Server } from "http";
import { type Server as HTTP2Server } from "spdy";
import { DB } from "DB";
import { Logger } from "Logger";
import { RedisCache } from "RedisCache";

export class ProcessManager {
  private static shuttingDown = false;
  public static Server?: HTTP2Server | HTTP1Server;

  public static listenForKills() {
    process.on("exit", this.killServices);
    process.on("SIGINT", this.killServices);
    process.on("SIGTERM", this.killServices);
  }

  private static killServices = () => {
    if (this.shuttingDown) {
      return;
    }
    this.shuttingDown = true;
    Logger.silence();
    void RedisCache.close();
    void DB.$disconnect();
    this.Server?.close();
  };
}
