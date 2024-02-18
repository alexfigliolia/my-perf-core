import { PrismaClient } from "@prisma/client";
import { Logger } from "Logger";
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
      Logger.GQL(error);
      let thrown: Error;
      if (error instanceof Error) {
        thrown = error;
      } else {
        thrown = new Error("ORM Error", { cause: error });
      }
      return onError(thrown) as ReturnType<E>;
    }
  }

  public static disconnect() {
    return this.Prisma.$disconnect();
  }
}
