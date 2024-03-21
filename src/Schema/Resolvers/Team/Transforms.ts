import { differenceInMonths, isBefore } from "date-fns";
import { MonthlyStatsTrendIteration, TrendIteration } from "Tools";
import type {
  IDAndName,
  ITeamProject,
  ITeamScope,
  IUserProfile,
  LinesPerTeam,
  MeshEntry,
  MonthlyStatsPerRepo,
  RawPRList,
  Standout,
  StatsEntry,
  StatsPerMonth,
  StatsPerUser,
} from "./types";

export class Transforms {
  public static parseTeamStats(stats: ITeamScope, projects: ITeamProject[]) {
    let totalLines = 0;
    let totalCommits = 0;
    const iterables: MonthlyStatsTrendIteration<any>[] = [];
    const { id, name, users } = stats;
    const results: StatsEntry[] = [];
    for (const user of users) {
      const { lines, commits, iterable, ...rest } = this.parseUserStats(user);
      totalLines += lines;
      totalCommits += commits;
      iterables.push(iterable);
      results.push({
        lines,
        commits,
        ...rest,
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

  public static parseUserStats(user: StatsPerUser) {
    let lines = 0;
    let commits = 0;
    const { id, name, overallStats, monthlyStats, pullRequests } = user;
    for (const repoStats of overallStats) {
      lines += repoStats.lines;
      commits += repoStats.commits;
    }
    const { linesPerMonth, iterable } = this.parseMonthlyStats(monthlyStats);
    return {
      id,
      name,
      lines,
      commits,
      linesPerMonth,
      pullRequests: pullRequests.length,
      iterable,
    };
  }

  public static parseProjects(projects: ITeamProject[]) {
    const trackedProjects: IDAndName[] = [];
    const iterable = new TrendIteration(
      projects,
      ({ id, name, date }, _index, instance) => {
        const trackDate = new Date(date);
        if (!isBefore(trackDate, instance.lastMonth)) {
          if (isBefore(trackDate, instance.currentMonth)) {
            instance.incrementLast();
          } else {
            instance.incrementCurrent();
          }
        }
        trackedProjects.push({ id, name });
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

  public static parseIndividualUserStats(user: IUserProfile) {
    let totalLines = 0;
    let totalCommits = 0;
    const { monthlyStats, overallStats, meshWith } = user;
    for (const { lines, commits } of overallStats) {
      totalLines += lines;
      totalCommits += commits;
    }
    const { linesPerMonth } = this.parseMonthlyStats(monthlyStats);
    return {
      id: user.id,
      linesPerMonth,
      name: user.name,
      lines: totalLines,
      commits: totalCommits,
      pullRequests: user.pullRequests.map(PR => ({
        id: PR.id,
        author: user.name,
        date: PR.date.toISOString(),
        description: PR.description,
        project: PR.repository.name,
      })),
      collaborators: meshWith.map(collab => ({
        ...this.parseUserStats(collab.user),
        totalLines: this.aggregateLinesPerTeam(collab.user.teams),
      })),
    };
  }

  private static aggregateLinesPerTeam(teams: LinesPerTeam[]) {
    let lines = 0;
    for (const team of teams) {
      for (const project of team.projects) {
        lines += project.repository.lines;
      }
    }
    return lines;
  }

  public static toMesh(nodes: MeshEntry[]) {
    const indexMap = new Map<number, number>();
    const userMap = new Map<number, string>();
    const key: string[] = [];
    let pointer = -1;
    for (const node of nodes) {
      const { user, toUser } = node;
      userMap.set(user.id, user.name);
      userMap.set(toUser.id, toUser.name);
      if (!indexMap.has(user.id)) {
        indexMap.set(user.id, ++pointer);
        key[pointer] = user.name;
      }
      if (!indexMap.has(toUser.id)) {
        indexMap.set(toUser.id, ++pointer);
        key[pointer] = toUser.name;
      }
    }
    const { size } = indexMap;
    const mesh: number[][] = new Array(size).fill([]);
    for (let i = 0; i < size; i++) {
      mesh[i] = new Array(size).fill(0);
    }
    for (const node of nodes) {
      const { user, toUser, count } = node;
      const userIndex = indexMap.get(user.id)!;
      const toUserIndex = indexMap.get(toUser.id)!;
      mesh[userIndex][toUserIndex] += count;
    }
    return {
      key,
      mesh,
    };
  }

  public static parsePRs(PRs: RawPRList[]) {
    return PRs.map(PR => ({
      id: PR.id,
      author: PR.user.name,
      description: PR.description,
      date: PR.date.toISOString(),
      project: PR.repository.name,
    }));
  }
}
