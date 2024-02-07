import "express-session";

declare module "express-session" {
  interface SessionData {
    userID: number | null;
    email: string | null;
  }
}
