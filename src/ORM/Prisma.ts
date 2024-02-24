import { PrismaClient } from "@prisma/client";
import { Logger } from "Logger";

export class Prisma extends PrismaClient {
  public async query<T extends Promise<any>>(
    transaction: T,
    onError?: (error: Error) => void,
  ) {
    try {
      const result = await transaction;
      if (!result) {
        throw new Error("ORM Error", {
          cause: result,
        });
      }
      return result;
    } catch (e) {
      let error: Error;
      if (!(e instanceof Error)) {
        error = new Error("ORM Error", { cause: e });
      } else {
        error = e;
      }
      Logger.ORM("Query Error", error);
      return onError?.(error);
    }
  }
}
