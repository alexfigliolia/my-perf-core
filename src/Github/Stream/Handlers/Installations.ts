import type { InstallationEvent } from "@octokit/webhooks-types";
import type { WebHookEvent } from "Github/API";
import { InstallationController } from "Schema/Resolvers/Installation/Controller";
import { BaseHandler } from "./BaseHandler";
import type { HandlerArgs } from "./types";

export class Installations extends BaseHandler<"installation"> {
  readonly events: WebHookEvent[] = ["installation"];
  constructor(...args: HandlerArgs) {
    super(...args);
    this.handler = this.handler.bind(this);
  }

  public handler(event: InstallationEvent) {
    switch (event.action) {
      case "created":
        return this.onNewInstallation(event);
      case "deleted":
        return this.onInstallationRemoved(event);
    }
  }

  private onNewInstallation(event: InstallationEvent) {
    if (event.action !== "created") {
      return;
    }
    const {
      id,
      account: { type },
    } = event.installation;
    if (type === "Organization" || type === "User") {
      void InstallationController.create({
        platform: "github",
        installation_id: id,
      });
    }
  }

  private onInstallationRemoved(event: InstallationEvent) {
    if (event.action !== "deleted") {
      return;
    }
    const { id } = event.installation;
    void InstallationController.delete(id);
  }
}
