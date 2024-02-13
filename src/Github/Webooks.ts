import { createHmac, timingSafeEqual } from "crypto";
import type { Express, Request } from "express";
import { EventEmitter } from "@figliolia/event-emitter";
import { Environment } from "Environment";
import { Logger } from "Logger";
import type { GithubEventStream } from "./types";

export class WebHooks {
  private Emitter = new EventEmitter<GithubEventStream>();

  public registerMiddleware(App: Express) {
    App.use("/github/events", (req, res) => {
      if (!this.verifyEvent(req)) {
        return res.status(401).send("Unauthorized");
      }
      const event = req.headers["x-github-event"] as keyof GithubEventStream;
      Logger.github(`Incoming ${event} event`, req.body);
      this.Emitter.emit(event, req.body);
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

  public verifyEvent(request: Request) {
    const signature = createHmac("sha256", Environment.GITHUB_WEBHOOK_SECRET)
      .update(JSON.stringify(request.body))
      .digest("hex");
    const trusted = Buffer.from(`sha256=${signature}`, "ascii");
    const untrusted = Buffer.from(
      request.headers["x-hub-signature-256"] as string,
      "ascii",
    );
    return timingSafeEqual(trusted, untrusted);
  }
}
