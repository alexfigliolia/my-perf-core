import type { MonthlyStatsTrendIteration } from "./MonthlyStatsTrendIteration";
import type { TrendIteration } from "./TrendIteration";

export type IterationCallback<T> = (
  item: T,
  index: number,
  instance: TrendIteration<T>,
) => void;

export type MonthlyTrendIterationCallback<T> = (
  item: T,
  index: number,
  instance: MonthlyStatsTrendIteration<T>,
) => void;
