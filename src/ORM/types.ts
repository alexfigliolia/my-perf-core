import type { ORM } from "./ORM";

export type Transaction = (DB: (typeof ORM)["Prisma"]) => any;

export type OnResult<T extends Transaction> = (
  result: NonNullable<Awaited<ReturnType<T>>>,
) => any;

export type OnError = (error: Error) => any;

export interface IQuery<
  T extends Transaction,
  R extends OnResult<T>,
  E extends OnError,
> {
  onError: E;
  onResult: R;
  transaction: T;
}
