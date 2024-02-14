import nodeFetch from "node-fetch";

export class API {
  protected async wrapRequest<T>(url: string, token: string) {
    const response = await nodeFetch(url, {
      method: "GET",
      headers: this.createHeaders(token),
    });
    return response.json() as unknown as T;
  }

  protected createHeaders(token: string) {
    return {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }
}
