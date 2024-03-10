import { differenceInMonths, isBefore, subMonths } from "date-fns";
import { GraphQLError } from "graphql";
import { ORM } from "ORM";
import type {
  IByTeam,
  ITeamScope,
  MonthlyStatsPerRepo,
  Standout,
  StatsEntry,
  StatsPerMonth,
} from "./types";

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
          name: true,
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
    return this.parseUserStats(stats);
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
    return this.calculateContributionDeltas(stats.users);
  }

  private static parseUserStats(stats: ITeamScope) {
    let totalLines = 0;
    let totalCommits = 0;
    const { name, users } = stats;
    const results: StatsEntry[] = [];
    for (const user of users) {
      let lines = 0;
      let commits = 0;
      for (const repoStats of user.overallStats) {
        lines += repoStats.lines;
        commits += repoStats.commits;
      }
      totalLines += lines;
      totalCommits += commits;
      results.push({
        id: user.id,
        name: user.name,
        lines,
        commits,
        linesPerMonth: this.parseMonthlyStats(user.monthlyStats),
      });
    }
    results.sort((a, b) => b.lines - a.lines);
    return {
      name,
      totalLines,
      totalCommits,
      users: results,
    };
  }

  private static calculateContributionDeltas(stats: StatsPerMonth[]) {
    const standouts: Standout[] = [];
    for (const user of stats) {
      let last = 0;
      let current = 0;
      for (const entry of user.monthlyStats) {
        if (isBefore(entry.date, subMonths(new Date(), 1))) {
          last += entry.lines;
        } else {
          current += entry.lines;
        }
      }
      let increase = Math.min(Math.round(((current - last) / last) * 100), 100);
      if (isNaN(increase) || increase === Infinity) {
        increase = current === 0 && last === 0 ? 0 : 100;
      }
      standouts.push({
        id: user.id,
        name: user.name,
        increase,
        lines: current,
      });
    }
    standouts.sort((a, b) => b.increase - a.increase);
    return standouts.slice(0, 4);
  }

  private static parseMonthlyStats(stats: MonthlyStatsPerRepo[]) {
    const linesPerMonth: number[] = new Array(12).fill(0);
    for (const entry of stats) {
      const index = differenceInMonths(entry.date, new Date());
      if (index > 11) {
        continue;
      }
      linesPerMonth[index] += entry.lines;
    }
    return linesPerMonth;
  }
}
