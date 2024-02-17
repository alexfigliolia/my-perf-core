import { PrismaClient } from "@prisma/client";
import { Logger } from "Logger/Logger";
import type { IQuery, OnError, OnResult, Transaction } from "./types";

export class ORM {
  private static Prisma = new PrismaClient({
    errorFormat: "pretty",
  });

  public static async query<
    T extends Transaction,
    R extends OnResult<T>,
    E extends OnError,
  >({ transaction, onResult, onError }: IQuery<T, R, E>) {
    try {
      const result = await transaction(this.Prisma);
      if (!result) {
        throw new Error("ORM Error", { cause: result });
      }
      return onResult(result) as ReturnType<R>;
    } catch (error) {
      Logger.GQL("Query Error", error);
      if (error instanceof Error) {
        return onError(error) as ReturnType<E>;
      }
      return onError(new Error("ORM Error", { cause: error })) as ReturnType<E>;
    }
  }

  public static disconnect() {
    return this.Prisma.$disconnect();
  }
}
