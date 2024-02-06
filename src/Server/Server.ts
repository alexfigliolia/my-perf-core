import type { Request, Response } from "express";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { readFileSync } from "fs";
import { type Server as HTTP1Server } from "http";
import path from "path";
import { createServer, type Server as HTTP2Server } from "spdy";
import { DB } from "DB";
import { Environment } from "Environment";
import { Logger } from "Logger";
import { RedisCache } from "RedisCache";
import { Schema } from "Schema";
import { Middleware } from "./Middleware";

export class Server {
  static APP = express();
  static Server?: HTTP2Server | HTTP1Server;
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
        graphiql: true,
        context: { req, res },
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

  private static listenForKills() {
    process.on("exit", () => this.killServices());
    process.on("SIGINT", () => this.killServices);
    process.on("SIGTERM", () => this.killServices);
  }

  private static killServices = () => {
    Logger.silence();
    void RedisCache.close();
    void DB.$disconnect();
    this.Server?.close();
  };
}
