import "express-session";

declare module "express-session" {
  interface SessionData {
    userID: number | null;
    loggedIn: boolean | null;
    githubUserToken: string | null;
  }
}
