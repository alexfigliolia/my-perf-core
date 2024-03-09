import { differenceInMonths, isBefore, subMonths } from "date-fns";
import { GraphQLError } from "graphql";
import { ORM } from "ORM";
import type {
  MonthlyStatsPerRepo,
  Standout,
  StatsEntry,
  StatsPerMonth,
  StatsPerUser,
} from "./types";

export class TeamController {
  public static async overallStatsPerUser(id: number) {
    const stats = await ORM.query(
      ORM.organization.findUnique({
        where: { id },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              monthlyStats: {
                where: {
                  AND: [
                    { organizationId: id },
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
                  organizationId: id,
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
    return this.parseUserStats(stats.users);
  }

  public static async getStandouts(id: number) {
    const stats = await ORM.query(
      ORM.organization.findUnique({
        where: { id },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              monthlyStats: {
                where: {
                  AND: [
                    { organizationId: id },
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

  private static parseUserStats(stats: StatsPerUser[]) {
    let totalLines = 0;
    let totalCommits = 0;
    const results: StatsEntry[] = [];
    for (const user of stats) {
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
