import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import type { Prisma } from "@prisma/client";
import { Schedule } from "GQL/AsyncService/Types";
import { ORM } from "ORM";
import type { IIndexRepoStats } from "Schema/Resolvers/AsyncJobs/types";
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
    const [, emailToUserID] =
      await OrganizationController.userEmailList(organizationId);
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
        userStats,
        repositoryId,
        emailToUserID,
        organizationId,
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
    userStats,
    repositoryId,
    emailToUserID,
    organizationId,
  }: IIndexStatsPerRepo) {
    const promises: Promise<any>[] = [];
    for (const stats of userStats) {
      const userId = emailToUserID.get(stats.email);
      if (!userId) {
        continue;
      }
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
              lines: stats.lines,
              commits: stats.commits,
            },
            create: {
              userId,
              repositoryId,
              organizationId,
              lines: stats.lines,
              commits: stats.commits,
            },
          }),
        ),
      );
      return Promise.all(promises);
    }
  }

  private async indexMonthlyStats({
    userStats,
    repositoryId,
    organizationId,
  }: IIndexRepoStats) {
    const [, emailToUserID] =
      await OrganizationController.userEmailList(organizationId);
    const creates: Prisma.MonthlyUserStatsCreateManyInput[] = [];
    for (const stats of userStats) {
      if (emailToUserID.has(stats.email)) {
        creates.push({
          repositoryId,
          organizationId,
          lines: stats.lines,
          commits: stats.commits,
          userId: emailToUserID.get(stats.email)!,
        });
      }
    }
    const entry = await ORM.query(
      ORM.monthlyUserStats.createMany({
        data: creates,
      }),
    );
    if (!entry) {
      throw Errors.createError(
        "UNEXPECTED_ERROR",
        "Failed to create user stats",
      );
    }
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
