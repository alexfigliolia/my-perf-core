import { AsyncServiceRequest } from "@alexfigliolia/my-performance-clients";
import type { InstallationType, Platform } from "@prisma/client";
import {
  checkRepositoryPullStatus,
  deleteRepositoryStatsJobs,
  registerRepositoryPull,
  registerRepositoryStatsPull,
  subscribeToRepositoryStats,
} from "GQL";
import type {
  CheckRepositoryPullStatusQuery,
  CheckRepositoryPullStatusQueryVariables,
  DeleteRepositoryStatsJobsMutation,
  DeleteRepositoryStatsJobsMutationVariables,
  Platform as APlatform,
  RegisterRepositoryPullMutation,
  RegisterRepositoryPullMutationVariables,
  RegisterRepositoryStatsPullMutation,
  RegisterRepositoryStatsPullMutationVariables,
  SubscribeToRepositoryStatsMutation,
  SubscribeToRepositoryStatsMutationVariables,
} from "GQL/AsyncService/Types";
import { RequestMethod } from "GQL/AsyncService/Types";
import type { IRegisterCloneJob, NewOrg } from "./types";

export class AsyncController {
  public static async registerRepositoryStatsPull(args: IRegisterCloneJob) {
    return AsyncServiceRequest<
      RegisterRepositoryStatsPullMutation,
      RegisterRepositoryStatsPullMutationVariables
    >({
      query: registerRepositoryStatsPull,
      variables: args,
    });
  }

  public static async subscribeToRepositoryStats(args: IRegisterCloneJob) {
    return AsyncServiceRequest<
      SubscribeToRepositoryStatsMutation,
      SubscribeToRepositoryStatsMutationVariables
    >({
      query: subscribeToRepositoryStats,
      variables: args,
    });
  }

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

  public static deleteRepositoryStatsJobs(id: number) {
    return AsyncServiceRequest<
      DeleteRepositoryStatsJobsMutation,
      DeleteRepositoryStatsJobsMutationVariables
    >({
      query: deleteRepositoryStatsJobs,
      variables: { repositoryId: id },
    });
  }

  public static async checkRepoPullStatus(organizationId: number) {
    try {
      const status = await AsyncServiceRequest<
        CheckRepositoryPullStatusQuery,
        CheckRepositoryPullStatusQueryVariables
      >({
        query: checkRepositoryPullStatus,
        variables: { organizationId },
      });
      return status.data.checkRepositoryPullStatus;
    } catch (error) {
      return "Unknown";
    }
  }
}
