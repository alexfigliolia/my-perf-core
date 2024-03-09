import { AsyncServiceRequest } from "@alexfigliolia/my-performance-clients";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import type { InstallationType, Platform } from "@prisma/client";
import { registerRepositoryPull } from "GQL";
import {
  checkRepositoryPullStatus,
  deleteRepositoryStatsJobs,
  registerRepositoryStatsPull,
  subscribeToRepositoryStats,
} from "GQL/AsyncService";
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
import { RequestMethod, Schedule } from "GQL/AsyncService/Types";
import { ORM } from "ORM";
import { OrganizationController } from "Schema/Resolvers/Organization/Controller";
import type {
  FilteredContributions,
  IIndexRepoStats,
  IRegisterRepoStatsPull,
  ISetRepositories,
  IUserStats,
  NewOrg,
} from "./types";

export class AsyncController {
  public static async registerRepositoryStatsPull(
    args: IRegisterRepoStatsPull,
  ) {
    return AsyncServiceRequest<
      RegisterRepositoryStatsPullMutation,
      RegisterRepositoryStatsPullMutationVariables
    >({
      query: registerRepositoryStatsPull,
      variables: args,
    });
  }

  public static async subscribeToRepositoryStats(args: IRegisterRepoStatsPull) {
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

  public static async indexRepositories({
    repositories,
    organizationId,
  }: ISetRepositories) {
    if (!repositories.length) {
      return [];
    }
    const results = await ORM.query(
      ORM.$transaction([
        ORM.repository.createMany({
          skipDuplicates: true,
          data: repositories.map(repo => ({
            ...repo,
            language: repo.language || "",
            description: repo.description || "",
          })),
        }),
        ORM.repository.findMany({
          where: {
            organizationId,
          },
        }),
      ]),
    );
    if (!results) {
      return [];
    }
    return results[1];
  }

  public static indexRepositoryStats(args: IIndexRepoStats) {
    if (!args.range) {
      return this.indexOverallStats(args);
    }
    if (args.range === Schedule.Monthly) {
      return this.indexMonthlyStats(args);
    }
    throw Errors.createError(
      "UNEXPECTED_ERROR",
      "Error indexing repository stats: not implemented",
    );
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

  private static async indexOverallStats({
    lines,
    commits,
    userStats,
    repositoryId,
    organizationId,
  }: IIndexRepoStats) {
    await this.deleteUserStatsForRepository(repositoryId);
    const [emailToUserID, stats] = await this.filterUserStats(
      organizationId,
      userStats,
    );
    const repository = await ORM.query(
      ORM.repository.update({
        where: {
          id: repositoryId,
        },
        data: {
          lines,
          commits,
          userStats: {
            createMany: {
              data: stats.map(stat => ({
                organizationId,
                lines: stat.lines,
                commits: stat.commits,
                userId: emailToUserID.get(stat.email)!,
              })),
            },
          },
        },
        include: {
          userStats: true,
        },
      }),
    );
    if (!repository) {
      throw Errors.createError(
        "UNEXPECTED_ERROR",
        "Error setting repository stats",
      );
    }
  }

  private static async indexMonthlyStats({
    userStats,
    repositoryId,
    organizationId,
  }: IIndexRepoStats) {
    const [emailToUserID, stats] = await this.filterUserStats(
      organizationId,
      userStats,
    );
    const entry = await ORM.query(
      ORM.monthlyUserStats.createMany({
        data: stats.map(stat => ({
          repositoryId,
          organizationId,
          lines: stat.lines,
          commits: stat.commits,
          userId: emailToUserID.get(stat.email)!,
        })),
      }),
    );
    if (!entry) {
      throw Errors.createError(
        "UNEXPECTED_ERROR",
        "Failed to create user stats",
      );
    }
  }

  private static async filterUserStats(
    organizationId: number,
    userStats: IUserStats[],
  ): Promise<FilteredContributions> {
    const [allEmails, emailToUserID] =
      await OrganizationController.userEmailList(organizationId);
    if (!allEmails || !emailToUserID) {
      throw Errors.createError("NOT_FOUND", "Organization not found");
    }
    return [
      emailToUserID,
      userStats.filter(stats => allEmails.has(stats.email)),
    ];
  }

  private static deleteUserStatsForRepository(id: number) {
    return ORM.query(
      ORM.overallUserStats.deleteMany({ where: { repositoryId: id } }),
    );
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
