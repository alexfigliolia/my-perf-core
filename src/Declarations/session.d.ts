import "express-session";

declare module "express-session" {
  interface SessionData {
    userID: number;
    email: string;
  }
}
