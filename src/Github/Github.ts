import { readFileSync } from "fs";
import { App, createNodeMiddleware } from "octokit";
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

  public static middleware = createNodeMiddleware(this.App, {
    pathPrefix: "/api/github/webhooks",
  });

  // https://github.com/apps/imgbot/installations/new
  static {
    this.App.webhooks.on("pull_request.opened", v => {
      Logger.github(v.payload);
    });
  }
}
