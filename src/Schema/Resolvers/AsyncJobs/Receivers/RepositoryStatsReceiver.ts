import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import { Schedule } from "GQL/AsyncService/Types";
import { ORM } from "ORM";
import { OrganizationController } from "Schema/Resolvers/Organization/Controller";
import type {
  FilteredContributions,
  IIndexRepoStats,
  IUserStats,
} from "../types";

export class RepositoryStatsReceiver {
  public indexRepositoryStats(args: IIndexRepoStats) {
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

  private async indexOverallStats({
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

  private async indexMonthlyStats({
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

  private async filterUserStats(
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

  private deleteUserStatsForRepository(id: number) {
    return ORM.query(
      ORM.overallUserStats.deleteMany({ where: { repositoryId: id } }),
    );
  }
}
