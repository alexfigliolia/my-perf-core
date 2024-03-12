import { differenceInMonths, isBefore } from "date-fns";
import { MonthlyStatsTrendIteration, TrendIteration } from "Tools";
import type {
  ITeamProject,
  ITeamScope,
  MonthlyStatsPerRepo,
  Standout,
  StatsEntry,
  StatsPerMonth,
} from "./types";

export class Transforms {
  public static parseUserStats(stats: ITeamScope) {
    let totalLines = 0;
    let totalCommits = 0;
    const iterables: MonthlyStatsTrendIteration<any>[] = [];
    const { id, name, users, projects } = stats;
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
      const { linesPerMonth, iterable } = this.parseMonthlyStats(
        user.monthlyStats,
      );
      iterables.push(iterable);
      results.push({
        id: user.id,
        name: user.name,
        lines,
        commits,
        linesPerMonth,
      });
    }
    results.sort((a, b) => b.lines - a.lines);
    const { lineTrend, commitTrend } =
      MonthlyStatsTrendIteration.aggregate(iterables);
    return {
      id,
      name,
      lineTrend,
      totalLines,
      commitTrend,
      totalCommits,
      users: results,
      projects: this.parseProjects(projects),
    };
  }

  public static parseProjects(projects: ITeamProject[]) {
    const trackedProjects: ITeamProject["repository"][] = [];
    const iterable = new TrendIteration(
      projects,
      (project, _index, instance) => {
        const trackDate = new Date(project.date);
        if (!isBefore(trackDate, instance.lastMonth)) {
          if (isBefore(trackDate, instance.currentMonth)) {
            instance.incrementLast();
          } else {
            instance.incrementCurrent();
          }
        }
        trackedProjects.push({
          id: project.repository.id,
          name: project.repository.name,
        });
      },
    );
    iterable.iterate();
    return {
      trackedProjects,
      trend: iterable.toTrend(),
    };
  }

  public static calculateContributionDeltas(stats: StatsPerMonth[]) {
    const standouts: Standout[] = [];
    for (const user of stats) {
      const iterable = new TrendIteration(
        user.monthlyStats,
        (stat, _index, instance) => {
          if (!isBefore(stat.date, instance.lastMonth)) {
            if (isBefore(stat.date, instance.currentMonth)) {
              instance.incrementLast(stat.lines);
            } else {
              instance.incrementCurrent(stat.lines);
            }
          }
        },
      );
      iterable.iterate();
      standouts.push({
        id: user.id,
        name: user.name,
        increase: iterable.toTrend(),
        lines: iterable.currentMonthTrend,
      });
    }
    standouts.sort((a, b) => b.increase - a.increase);
    return standouts.slice(0, 4);
  }

  public static parseMonthlyStats(stats: MonthlyStatsPerRepo[]) {
    const linesPerMonth: number[] = new Array(12).fill(0);
    const iterable = new MonthlyStatsTrendIteration(
      stats,
      (entry, _index, instance) => {
        const index = differenceInMonths(new Date(entry.date), new Date());
        if (index > 11) {
          return;
        }
        linesPerMonth[11 - index] += entry.lines;
        if (index === 0) {
          instance.incrementCurrentMonthLines(entry.lines);
          instance.incrementCurrentMonthCommits(entry.commits);
        } else if (index === 1) {
          instance.incrementLastMonthLines(entry.lines);
          instance.incrementLastMonthCommits(entry.commits);
        }
      },
    );
    iterable.iterate();
    return {
      iterable,
      linesPerMonth,
    };
  }
}
