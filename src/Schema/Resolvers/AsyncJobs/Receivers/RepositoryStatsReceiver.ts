import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import { Schedule } from "GQL/AsyncService/Types";
import { ORM } from "ORM";
import type {
  IIndexRepoStats,
  IUserStats,
} from "Schema/Resolvers/AsyncJobs/types";
import { OrganizationController } from "Schema/Resolvers/Organization/Controller";
import type { IIndexMesh, IIndexPRs, IIndexStatsPerRepo } from "./types";

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
    mesh,
    lines,
    commits,
    userStats,
    pullRequests,
    repositoryId,
    organizationId,
  }: IIndexRepoStats) {
    const [emails, emailToUserID] =
      await OrganizationController.userEmailList(organizationId);
    if (!emails || !emailToUserID) {
      throw Errors.createError("NOT_FOUND", "Organization not found");
    }
    await Promise.all([
      this.indexMesh({
        mesh,
        emailToUserID,
        organizationId,
      }),
      this.indexPRs({
        pullRequests,
        repositoryId,
        emailToUserID,
      }),
      this.indexStatsPerRepo({
        repositoryId,
        emailToUserID,
        organizationId,
        stats: this.filterUserStats(userStats, emails),
      }),
      await ORM.query(
        ORM.repository.update({
          where: {
            id: repositoryId,
          },
          data: {
            lines,
            commits,
          },
        }),
      ),
    ]);
  }

  private indexStatsPerRepo({
    organizationId,
    repositoryId,
    emailToUserID,
    stats,
  }: IIndexStatsPerRepo) {
    const promises: Promise<any>[] = [];
    for (const stat of stats) {
      const userId = emailToUserID.get(stat.email);
      if (userId) {
        promises.push(
          ORM.query(
            ORM.overallUserStats.upsert({
              where: {
                userId_repositoryId: {
                  userId,
                  repositoryId,
                },
              },
              update: {
                lines: stat.lines,
                commits: stat.commits,
              },
              create: {
                userId,
                repositoryId,
                organizationId,
                lines: stat.lines,
                commits: stat.commits,
              },
            }),
          ),
        );
      }
      return Promise.all(promises);
    }
  }

  private async indexMonthlyStats({
    userStats,
    repositoryId,
    organizationId,
  }: IIndexRepoStats) {
    const [emails, emailToUserID] =
      await OrganizationController.userEmailList(organizationId);
    if (!emails || !emailToUserID) {
      throw Errors.createError("NOT_FOUND", "Organization not found");
    }
    const stats = this.filterUserStats(userStats, emails);
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

  private filterUserStats(stats: IUserStats[], emails: Set<string>) {
    return stats.filter(stats => emails.has(stats.email));
  }

  private indexMesh({ mesh, emailToUserID, organizationId }: IIndexMesh) {
    const promises: Promise<any>[] = [];
    for (const key in mesh) {
      if (!emailToUserID.has(key)) {
        continue;
      }
      const userId = emailToUserID.get(key)!;
      for (const user in mesh[key]) {
        if (!emailToUserID.has(user)) {
          continue;
        }
        const increment = mesh[key][user];
        const toUserId = emailToUserID.get(user)!;
        promises.push(
          ORM.query(
            ORM.mesh.upsert({
              where: {
                userId_toUserId_organizationId: {
                  userId,
                  toUserId,
                  organizationId,
                },
              },
              update: {
                count: {
                  increment,
                },
              },
              create: {
                userId,
                toUserId,
                count: increment,
                organizationId,
              },
            }),
          ),
        );
      }
    }
    return Promise.allSettled(promises);
  }

  private indexPRs({ repositoryId, pullRequests, emailToUserID }: IIndexPRs) {
    if (!pullRequests.length) {
      return;
    }
    const promises: Promise<any>[] = [];
    for (const PR of pullRequests) {
      const userId = emailToUserID.get(PR.author);
      if (!userId) {
        continue;
      }
      const args = {
        userId,
        repositoryId,
        date: PR.date,
        description: PR.description,
      };
      promises.push(
        ORM.query(
          ORM.pullRequest.upsert({
            where: {
              userId_description_repositoryId_date: args,
            },
            create: args,
            update: args,
          }),
        ),
      );
    }
    return Promise.all(promises);
  }
}
