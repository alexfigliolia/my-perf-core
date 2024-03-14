import { subMonths } from "date-fns";
import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import { ORM } from "ORM";
import { Transforms } from "./Transforms";
import type { IByTeam } from "./types";

export class TeamController {
  public static async overallStatsPerUser({ organizationId, teamId }: IByTeam) {
    const repos = await this.getTrackedRepositories(teamId);
    const IDs = repos.map(repo => repo.id);
    const stats = await ORM.query(
      ORM.team.findUnique({
        where: {
          id_organizationId: {
            id: teamId,
            organizationId,
          },
        },
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              name: true,
              overallStats: {
                where: {
                  AND: [{ organizationId }, { repositoryId: { in: IDs } }],
                },
                select: {
                  lines: true,
                  commits: true,
                },
              },
              monthlyStats: {
                where: {
                  AND: [
                    { organizationId },
                    {
                      date: {
                        gte: subMonths(new Date(), 12).toISOString(),
                      },
                    },
                    { repositoryId: { in: IDs } },
                  ],
                },
                select: {
                  date: true,
                  lines: true,
                  commits: true,
                },
              },
            },
          },
        },
      }),
    );
    if (!stats) {
      throw new GraphQLError("This organization's users were not found");
    }
    return Transforms.parseUserStats(stats, repos);
  }

  public static async getStandouts({ organizationId, teamId }: IByTeam) {
    const stats = await ORM.query(
      ORM.team.findUnique({
        where: {
          id_organizationId: {
            id: teamId,
            organizationId,
          },
        },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              monthlyStats: {
                where: {
                  AND: [
                    { organizationId },
                    { date: { gte: subMonths(new Date(), 2).toISOString() } },
                  ],
                },
                select: {
                  date: true,
                  lines: true,
                },
              },
            },
          },
        },
      }),
    );
    if (!stats) {
      throw new GraphQLError("This organization's users were not found");
    }
    return Transforms.calculateContributionDeltas(stats.users);
  }

  public static async getTrackedRepositories(teamId: number) {
    const tracked = await ORM.query(
      ORM.trackedRepository.findMany({
        where: {
          teamId,
        },
        select: {
          date: true,
          repository: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    );
    if (!tracked) {
      throw Errors.createError(
        "NOT_FOUND",
        "The current team's projects were not found. Please try again",
      );
    }
    return tracked.map(t => ({
      date: t.date,
      id: t.repository.id,
      name: t.repository.name,
    }));
  }
}
