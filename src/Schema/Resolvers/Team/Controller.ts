import { isBefore, subMonths } from "date-fns";
import { GraphQLError } from "graphql";
import { ORM } from "ORM";
import type {
  Standout,
  StatsEntry,
  StatsPerMonth,
  StatsPerUser,
} from "./types";

export class TeamController {
  public static async getHighestContributors(id: number) {
    const stats = await ORM.query(
      ORM.organization.findUnique({
        where: { id },
        select: {
          users: {
            select: {
              id: true,
              name: true,
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
    return this.parseStatsPerMonth(stats.users);
  }

  private static parseUserStats(stats: StatsPerUser[]) {
    const results: StatsEntry[] = [];
    for (const user of stats) {
      let lines = 0;
      let commits = 0;
      for (const repoStats of user.overallStats) {
        lines += repoStats.lines;
        commits += repoStats.commits;
      }
      results.push({
        id: user.id,
        name: user.name,
        lines,
        commits,
      });
    }
    results.sort((a, b) => b.lines - a.lines);
    return results.slice(0, 10);
  }

  private static parseStatsPerMonth(stats: StatsPerMonth[]) {
    const standouts: Standout[] = [];
    for (const user of stats) {
      let last = 1;
      let current = 0;
      for (const entry of user.monthlyStats) {
        if (isBefore(entry.date, subMonths(new Date(), 1))) {
          last += entry.lines;
        } else {
          current += entry.lines;
        }
      }
      const increase = Math.min(
        Math.round(((current - last) / last) * 100),
        100,
      );
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
}
