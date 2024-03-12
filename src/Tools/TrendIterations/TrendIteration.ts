import { subMonths } from "date-fns";
import type { IterationCallback } from "./types";

export class TrendIteration<T> {
  list: T[];
  now = new Date();
  lastMonthTrend = 0;
  currentMonthTrend = 0;
  callback: IterationCallback<T>;
  lastMonth = subMonths(this.now, 2);
  currentMonth = subMonths(this.now, 1);
  constructor(list: T[], callback: IterationCallback<T>) {
    this.list = list;
    this.callback = callback;
  }

  public iterate() {
    let pointer = -1;
    for (const item of this.list) {
      this.callback(item, ++pointer, this);
    }
  }

  public incrementLast(N = 1) {
    this.lastMonthTrend += N;
  }

  public incrementCurrent(N = 1) {
    this.currentMonthTrend += N;
  }

  public toTrend() {
    return TrendIteration.trend(this.currentMonthTrend, this.lastMonthTrend);
  }

  public static trend(current: number, last: number) {
    let increase = Math.min(Math.round(((current - last) / last) * 100), 100);
    if (isNaN(increase) || increase === Infinity) {
      increase = current === 0 && last === 0 ? 0 : 100;
    }
    return increase;
  }
}
