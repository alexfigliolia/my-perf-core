import nodeFetch from "node-fetch";
import { Environment } from "Environment";
import { API } from "./API";
import type { AccessToken, GithubEmail, GithubUser } from "./types";

export class OAuth extends API {
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

  private extractFirstEmail(list: GithubEmail[]) {
    for (const email of list) {
      if (email.primary) {
        return email.email;
      }
    }
    return list?.[0]?.email ?? "";
  }
}
