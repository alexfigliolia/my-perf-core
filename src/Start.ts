import { Logger } from "Logger";
import { Server } from "Server";

(async () => {
  await Server.start();
})().catch(Logger.core);
