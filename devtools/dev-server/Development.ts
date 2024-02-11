import chalk from "chalk";
import type { ChildProcess as CP } from "child_process";
import process from "process";
import { ChildProcess } from "@figliolia/child-process";

export class Development {
  private static TSX?: CP;
  private static readonly serviceCommands = {
    Redis: "brew services start redis",
    Postgres: "brew services start postgresql@14",
  } as const;
  private static readonly killCommands = {
    Redis: "brew services stop redis",
    Postgres: "brew services stop postgresql@14",
  } as const;

  public static async run() {
    this.log("Booting up...");
    try {
      this.listenForKills();
      await this.bootServices();
      const { handler, process } = new ChildProcess(
        "tsx watch --clear-screen=false src/Start.ts",
      );
      this.TSX = process;
      this.listenForKills(this.TSX);
      return handler;
    } catch (error) {
      await this.killAll();
    }
  }

  private static async killAll() {
    if (this.TSX) {
      this.TSX?.kill();
      this.TSX = undefined;
      await this.killServices();
    }
  }

  private static listenForKills(current: NodeJS.Process | CP = process) {
    current.on("exit", () => void this.killAll());
    current.on("SIGINT", () => void this.killAll());
    current.on("SIGTERM", () => void this.killAll());
  }

  private static async bootServices() {
    this.logServiceAction("Booting");
    return Promise.all(this.services.map(c => new ChildProcess(c).handler));
  }

  private static killServices() {
    this.logServiceAction("Killing");
    return Promise.all(this.kills.map(c => ChildProcess.execute(c)));
  }

  private static get services() {
    return Object.values(this.serviceCommands);
  }

  private static get kills() {
    return Object.values(this.killCommands);
  }

  private static logServiceAction(action: string) {
    this.log(`${action} ${Object.keys(this.serviceCommands).join(", ")}`);
  }

  private static log(...messages: string[]) {
    console.log(chalk.magentaBright.bold("Dev Server:"), ...messages);
  }
}
