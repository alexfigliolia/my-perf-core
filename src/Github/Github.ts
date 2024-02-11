import type { Express } from "express";
import { readFileSync } from "fs";
import { App } from "octokit";
import { createNodeMiddleware } from "@octokit/webhooks";
import { Environment } from "Environment";
import { Logger } from "Logger";

export class Github {
  public static App = new App({
    appId: Environment.GITHUB_APP_ID,
    webhooks: {
      secret: Environment.GITHUB_WEBHOOK_SECRET,
    },
    privateKey: readFileSync(Environment.GITHUB_CERT_PATH, "utf8"),
    oauth: { clientId: "", clientSecret: "" },
  });

  public static registerMiddleware(App: Express) {
    App.use((req, res) => {
      void createNodeMiddleware(this.App.webhooks, {
        path: "/github/events",
      })(req, res);
    });
  }

  static {
    this.App.webhooks.on("installation", v => {
      Logger.github(v);
    });
  }
}
