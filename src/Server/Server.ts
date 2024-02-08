import type { Request, Response } from "express";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { readFileSync } from "fs";
import path from "path";
import { createServer } from "spdy";
import { Environment } from "Environment";
import { Errors } from "Errors";
import { Logger } from "Logger";
import { RedisCache } from "RedisCache";
import { Schema } from "Schema";
import { Middleware } from "./Middleware";
import { ProcessManager } from "./ProcessManager";

export class Server extends ProcessManager {
  static APP = express();
  static CERTS = path.resolve(__dirname, "../../cert");

  public static async start() {
    this.listenForKills();
    await RedisCache.start();
    Middleware.register(this.APP).build();
    this.registerGQL();
    const server = this.registerHTTP2();
    this.Server = server.listen({ port: Environment.SERVER_PORT });
    return this.Server;
  }

  public static get() {
    if (!this.Server) {
      return this.start();
    }
    return this.Server;
  }

  private static registerGQL() {
    this.APP.all("/graphql", (req: Request, res: Response) => {
      void graphqlHTTP({
        schema: Schema,
        graphiql: !Environment.LOCAL,
        context: { req, res },
        customFormatErrorFn: Errors.handler(res),
      })(req, res);
    });
    Logger.GQL("Mounting GraphQL");
  }

  private static registerHTTP2() {
    if (!Environment.SSL) {
      Logger.core("Running HTTP/1");
      return this.APP;
    }
    Logger.core("Running HTTP/2");
    return createServer(this.keys, this.APP);
  }

  private static get keys() {
    return {
      key: readFileSync(`${this.CERTS}/server.key`),
      cert: readFileSync(`${this.CERTS}/server.cert`),
    };
  }
}
