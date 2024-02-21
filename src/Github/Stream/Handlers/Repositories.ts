import type { RepositoryEvent } from "@octokit/webhooks-types";
import type { WebHookEvent } from "Github/API";
import { InstallationController } from "Schema/Resolvers/Installation/Controller";
import { RepositoryController } from "Schema/Resolvers/Repositories/Controller";
import { BaseHandler } from "./BaseHandler";

export class Repositories extends BaseHandler<"repository"> {
  readonly events: WebHookEvent[] = ["repository"];

  public handler = (event: RepositoryEvent) => {
    switch (event.action) {
      case "created":
        return this.onNewRepository(event);
      case "deleted":
        return this.onRepositoryDeleted(event);
      case "edited":
        return this.onRepositoryUpdated(event);
    }
  };

  private async onNewRepository(event: RepositoryEvent) {
    if (event.action !== "created" || !event.installation) {
      return;
    }
    const { repository, installation } = event;
    const { id } = await InstallationController.getOrganization(
      installation.id,
      "github",
    );
    void RepositoryController.createGithubRepository(repository, id);
  }

  private onRepositoryDeleted(event: RepositoryEvent) {
    if (event.action !== "deleted") {
      return;
    }
    void RepositoryController.deleteGithubRepository(event.repository.id);
  }

  private onRepositoryUpdated(event: RepositoryEvent) {
    if (event.action !== "edited") {
      return;
    }
    void RepositoryController.updateGithubRepositoryByPlatformID(
      event.repository,
    );
  }
}
