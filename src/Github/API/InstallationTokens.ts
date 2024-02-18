import { readFileSync } from "fs";
import { decode, sign } from "jsonwebtoken";
import { Environment } from "Environment";
import { API } from "./API";
import type { IInstallationToken, ITokenValidation } from "./types";

export class InstallationTokens extends API {
  private static TEN_MINUTES = 1000 * 60 * 10;
  private static KEY = readFileSync(Environment.GITHUB_CERT_PATH);
  private static lastToken = this.generateJWT();

  public static async create(installation_id: number) {
    return this.wrapPost<IInstallationToken>(
      `https://api.github.com/app/installations/${installation_id}/access_tokens`,
      this.JWT,
    );
  }

  public static async validateToken({
    token,
    expiration,
    installation_id,
  }: ITokenValidation) {
    if (new Date(expiration).getTime() > Date.now()) {
      return { token, expires_at: expiration };
    }
    return this.create(installation_id);
  }

  public static get JWT() {
    const payload = decode(this.lastToken, { json: true });
    if (
      !payload ||
      !payload.exp ||
      Date.now() - payload.exp > this.TEN_MINUTES
    ) {
      this.lastToken = this.generateJWT();
    }
    return this.lastToken;
  }

  private static generateJWT() {
    return sign({}, this.KEY, {
      algorithm: "RS256",
      expiresIn: 10 * 60,
      issuer: Environment.GITHUB_APP_ID,
    });
  }
}
