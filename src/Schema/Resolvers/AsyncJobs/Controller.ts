import { GraphQLError } from "graphql";
import { AsyncServiceRequest } from "@alexfigliolia/my-performance-clients";
import type { InstallationType, Platform } from "@prisma/client";
import { registerRepositoryPull } from "GQL";
import { registerRepositoryStatsPull } from "GQL/AsyncService";
import type {
  Platform as APlatform,
  RegisterRepositoryPullMutation,
  RegisterRepositoryPullMutationVariables,
  RegisterRepositoryStatsPullMutation,
  RegisterRepositoryStatsPullMutationVariables,
} from "GQL/AsyncService/Types";
import { RequestMethod } from "GQL/AsyncService/Types";
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
    if (args.date) {
      return this.indexMonthlyStats(args);
    }
    return this.indexOverallStats(args);
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
      throw new GraphQLError("Error setting repository stats");
    }
  }

  private static async indexMonthlyStats({
    date,
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
          date,
          repositoryId,
          lines: stat.lines,
          commits: stat.commits,
          userId: emailToUserID.get(stat.email)!,
        })),
      }),
    );
    if (!entry) {
      throw new GraphQLError("Failed to create user stats");
    }
  }

  private static async filterUserStats(
    organizationId: number,
    userStats: IUserStats[],
  ): Promise<FilteredContributions> {
    const [allEmails, emailToUserID] =
      await OrganizationController.userEmailList(organizationId);
    if (!allEmails || !emailToUserID) {
      throw new GraphQLError("Organization not found");
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
}
