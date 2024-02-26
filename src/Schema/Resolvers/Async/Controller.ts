import type { InstallationType, Platform } from "@prisma/client";
import { AsyncServiceRequest, registerRepositoryPull } from "GQL";
import {
  type Platform as APlatform,
  type RegisterRepositoryPullMutation,
  type RegisterRepositoryPullMutationVariables,
  RequestMethod,
} from "GQL/AsyncService/Types";
import type { NewOrg } from "./types";

export class AsyncController {
  public static registerRepositoryPull(organization: NewOrg, token: string) {
    const { id, name, installations } = organization;
    return Promise.all(
      installations.map(install => {
        const { platform, type } = install;
        return AsyncServiceRequest<
          RegisterRepositoryPullMutation,
          RegisterRepositoryPullMutationVariables
        >({
          query: registerRepositoryPull,
          variables: {
            token,
            organizationId: id,
            platform: platform as APlatform,
            requestMethod: RequestMethod.Get,
            api_url: this.pullURL(name, platform, type),
          },
        });
      }),
    );
  }

  private static pullURL(
    name: string,
    platform: Platform,
    type: InstallationType,
  ) {
    switch (platform) {
      case "github": {
        if (type === "individual") {
          return "https://api.github.com/user/repos";
        }
        return `https://api.github.com/orgs/${name}/repos`;
      }
      case "bitbucket":
      default: {
        throw new Error("Unimplemented");
      }
    }
  }
}
