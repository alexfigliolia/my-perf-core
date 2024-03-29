import bodyParser from "body-parser";
import RedisStore from "connect-redis";
import cors from "cors";
import type { Express, Request, Response } from "express";
import session from "express-session";
import { createYoga } from "graphql-yoga";
import { Environment } from "Environment";
import { WebHooks } from "Github/API";
import { Logger } from "Logger";
import { RedisCache } from "RedisCache";
import { Schema } from "Schema";
import { Sessions } from "Sessions";

export class Middleware {
  static App: Express;

  public static register(App: Express) {
    this.App = App;
    return this;
  }

  public static build() {
    this.guard();
    this.configureParser();
    this.configureCors();
    this.configureSessions();
    this.registerGQL();
    this.registerGithub();
  }

  private static configureParser() {
    this.App.use(bodyParser.json());
    this.App.use(bodyParser.urlencoded({ extended: true }));
  }

  private static configureCors() {
    this.App.use(
      cors({
        credentials: true,
        optionsSuccessStatus: 200,
        origin: Environment.origins,
      }),
    );
    this.App.set("trust proxy", 1);
  }

  private static configureSessions() {
    this.App.use(
      session({
        store: new RedisStore({ client: RedisCache.Client }),
        secret: Environment.AUTH_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          sameSite: true,
          httpOnly: true,
          maxAge: Sessions.AGE,
          secure: Environment.SSL,
          expires: new Date(Date.now() + Sessions.AGE),
        },
      }),
    );
  }

  private static registerGQL() {
    Logger.GQL("Mounting GraphQL");
    const yoga = createYoga({
      schema: Schema,
      graphqlEndpoint: "/graphql",
      graphiql: Environment.LOCAL,
    });
    this.App.use(
      yoga.graphqlEndpoint,
      (req: Request, res: Response) => void yoga(req, res),
    );
  }

  private static registerGithub() {
    WebHooks.registerMiddleware(this.App);
  }

  private static guard() {
    if (!this.App) {
      throw new Error(
        "Did you forget to call Middleware.register() with your Express instance",
      );
    }
  }
}
