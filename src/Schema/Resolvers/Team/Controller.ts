import { subMonths } from "date-fns";
import { GraphQLError } from "graphql";
import { ORM } from "ORM";
import { Transforms } from "./Transforms";
import type { IByTeam } from "./types";

export class TeamController {
  public static async overallStatsPerUser({ organizationId, teamId }: IByTeam) {
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
          projects: {
            select: {
              date: true,
              repository: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          users: {
            select: {
              id: true,
              name: true,
              monthlyStats: {
                where: {
                  AND: [
                    { organizationId },
                    { date: { gte: subMonths(new Date(), 12).toISOString() } },
                  ],
                },
                select: {
                  date: true,
                  lines: true,
                  commits: true,
                },
              },
              overallStats: {
                where: {
                  organizationId,
                },
                select: {
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
    return Transforms.parseUserStats(stats);
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
}
