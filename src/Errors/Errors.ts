import type { Response } from "express";
import { GraphQLError } from "graphql";
import type { GQLErrorType } from "./types";

export class Errors {
  public static readonly NOT_FOUND = {
    status: 404,
    code: "NOT_FOUND",
  };
  public static readonly BAD_REQUEST = {
    status: 400,
    code: "BAD_REQUEST",
  };
  public static readonly UNAUTHORIZED = {
    status: 401,
    code: "UNAUTHORIZED",
  };
  public static readonly UNEXPECTED_ERROR = {
    status: 500,
    code: "UNEXPECTED_ERROR",
  };

  public static createError(
    type: GQLErrorType,
    message: string,
    error?: Error,
  ) {
    return new GraphQLError(message, {
      extensions: this[type],
      originalError: error,
    });
  }

  public static handler(response: Response) {
    return (error: GraphQLError) => {
      const status = error.extensions?.status as number;
      response.status(status || 500);
      return error;
    };
  }
}
