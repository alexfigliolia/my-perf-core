import nodeFetch from "node-fetch";
import { Environment } from "Environment";
import type { AccessToken, GithubEmail, GithubUser } from "./types";

export class OAuth {
  public async generateToken(code: string) {
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
    return response.json() as unknown as AccessToken;
  }

  public async getUser(token: string): Promise<GithubUser> {
    const [user, emails] = await Promise.all([
      this.wrapRequest<GithubUser>("https://api.github.com/user", token),
      this.wrapRequest<GithubEmail[]>(
        "https://api.github.com/user/emails",
        token,
      ),
    ]);
    return {
      ...user,
      email: this.extractFirstEmail(emails),
    };
  }

  private async wrapRequest<T>(url: string, token: string) {
    const response = await nodeFetch(url, {
      method: "GET",
      headers: this.createHeaders(token),
    });
    return response.json() as unknown as T;
  }

  private createHeaders(token: string) {
    return {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  private extractFirstEmail(list: GithubEmail[]) {
    for (const email of list) {
      if (email.primary) {
        return email.email;
      }
    }
    return list?.[0]?.email ?? "";
  }
}
