import nodeFetch from "node-fetch";
import { Environment } from "Environment";
import { API } from "./API";
import type {
  AccessToken,
  GithubAPIError,
  GithubEmail,
  GithubUser,
} from "./types";

export class OAuth extends API {
  public static async generateToken(code: string) {
    const url = new URL("https://github.com/login/oauth/access_token");
    url.searchParams.set("code", code);
    url.searchParams.set("client_id", Environment.GITHUB_CLIENT_ID);
    url.searchParams.set("client_secret", Environment.GITHUB_CLIENT_SECRET);
    const response = await nodeFetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
    return response.json() as unknown as AccessToken | GithubAPIError;
  }

  public static async getUser(token: string) {
    const [user, emails] = await Promise.all([
      this.wrapGet<GithubUser>("https://api.github.com/user", token),
      this.getUserEmails(token),
    ]);
    return { user, emails };
  }

  public static getUserEmails(token: string) {
    return this.wrapGet<GithubEmail[]>(
      "https://api.github.com/user/emails",
      token,
    );
  }
}
