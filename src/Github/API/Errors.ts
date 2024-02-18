import type { GithubAPIError } from "./types";

export class Errors {
  public static isAPIEror<T>(
    response: T | GithubAPIError,
  ): response is GithubAPIError {
    // @ts-ignore
    return response && typeof response?.message === "string";
  }
}
