import { GraphQLClient } from "graphql-request";
import nodeFetch from "node-fetch";
import type { ErrorHandling, IGQLRequest } from "./types";

export class GQLClient<D, V extends Record<string, any> = Record<string, any>> {
  url: string;
  query: string;
  variables: V;
  errorHandling: ErrorHandling;
  signal = new AbortController();
  constructor({
    url,
    query,
    variables,
    errorHandling = "first",
  }: IGQLRequest<V>) {
    this.url = url;
    this.query = query;
    this.variables = variables;
    this.errorHandling = errorHandling;
  }

  public async request() {
    const client = new GraphQLClient(this.url, {
      mode: "cors",
      method: "POST",
      errorPolicy: "all",
      credentials: "include",
      signal: this.signal.signal,
      fetch: nodeFetch as unknown as typeof fetch,
    });
    try {
      const response = await client.rawRequest<D>(this.query, this.variables);
      if (response.errors?.length) {
        throw response;
      }
      return response;
    } catch (error: any) {
      if (this.errorHandling === "first" && error?.response?.errors?.length) {
        throw new Error(error.response.errors[0].message);
      }
      throw error;
    }
  }

  public abort() {
    this.signal.abort();
  }
}
