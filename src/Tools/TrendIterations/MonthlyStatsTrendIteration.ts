import { subMonths } from "date-fns";
import { TrendIteration } from "./TrendIteration";
import type { MonthlyTrendIterationCallback } from "./types";

export class MonthlyStatsTrendIteration<T> {
  list: T[];
  now = new Date();
  lastMonthLines = 0;
  lastMonthCommits = 0;
  currentMonthLines = 0;
  currentMonthCommits = 0;
  lastMonth = subMonths(this.now, 2);
  currentMonth = subMonths(this.now, 1);
  callback: MonthlyTrendIterationCallback<T>;
  constructor(list: T[], callback: MonthlyTrendIterationCallback<T>) {
    this.list = list;
    this.callback = callback;
  }

  public iterate() {
    let pointer = -1;
    for (const item of this.list) {
      this.callback(item, ++pointer, this);
    }
  }

  public incrementCurrentMonthLines(N = 1) {
    this.currentMonthLines += N;
  }

  public incrementCurrentMonthCommits(N = 1) {
    this.currentMonthCommits += N;
  }

  public incrementLastMonthLines(N = 1) {
    this.lastMonthLines += N;
  }

  public incrementLastMonthCommits(N = 1) {
    this.lastMonthCommits += N;
  }

  public toLineTrend() {
    return TrendIteration.trend(this.currentMonthLines, this.lastMonthLines);
  }

  public toCommitTrend() {
    return TrendIteration.trend(
      this.currentMonthCommits,
      this.lastMonthCommits,
    );
  }

  public static aggregate(iterables: MonthlyStatsTrendIteration<any>[]) {
    let lastMonthLines = 0;
    let lastMonthCommits = 0;
    let currentMonthLines = 0;
    let currentMonthCommits = 0;
    for (const iterable of iterables) {
      lastMonthLines += iterable.lastMonthLines;
      lastMonthCommits += iterable.lastMonthCommits;
      currentMonthLines += iterable.currentMonthLines;
      currentMonthCommits += iterable.currentMonthCommits;
    }
    return {
      lineTrend: TrendIteration.trend(currentMonthLines, lastMonthLines),
      commitTrend: TrendIteration.trend(currentMonthCommits, lastMonthCommits),
    };
  }
}
