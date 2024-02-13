import "dotenv/config";

export class Environment {
  public static SSL = !!process.env.SSL;
  public static LOCAL = !!process.env.LOCAL;
  public static REDIS_URL = this.accessOrThrow("REDIS_URL");
  public static SERVER_PORT = this.parsePort("SERVER_PORT");
  public static AUTH_SECRET = this.accessOrThrow("AUTH_SECRET");
  public static POSTGRES_URL = this.accessOrThrow("POSTGRES_URL");
  public static GITHUB_APP_ID = this.accessOrThrow("GITHUB_APP_ID");
  public static GITHUB_CERT_PATH = this.accessOrThrow("GITHUB_CERT_PATH");
  public static GITHUB_CLIENT_ID = this.accessOrThrow("GITHUB_CLIENT_ID");
  public static GITHUB_CLIENT_SECRET = this.accessOrThrow(
    "GITHUB_CLIENT_SECRET",
  );
  public static GITHUB_WEBHOOK_SECRET = this.accessOrThrow(
    "GITHUB_WEBHOOK_SECRET",
  );

  public static get origin() {
    if (this.LOCAL) {
      return "http://localhost:3000";
    }
    return "https://my-performance.vercel.app";
  }

  private static accessOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Required environment variable "${key}" is not set`);
    }
    return value;
  }

  private static parsePort(key: string) {
    const value = parseInt(this.accessOrThrow(key));
    if (isNaN(value)) {
      throw new Error(
        `Required environment variable "${key}" is not set to a valid port number`,
      );
    }
    return value;
  }
}
