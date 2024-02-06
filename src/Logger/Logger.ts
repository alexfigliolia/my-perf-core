import chalk from "chalk";

export class Logger {
  private static readonly NOOP = () => {};
  private static readonly _LOG = console.log;
  private static LOG = this._LOG;

  public static redis(...messages: any[]) {
    this.LOG(chalk.redBright.bold("Redis:"), ...messages);
  }

  public static core(...messages: any[]) {
    this.LOG(chalk.blueBright.bold("Core:"), ...messages);
  }

  public static GQL(...messages: any[]) {
    this.LOG(chalk.greenBright.bold("GQL:"), ...messages);
  }

  public static github(...messages: any[]) {
    this.LOG(chalk.cyanBright.bold("Github:"), ...messages);
  }

  public static silence() {
    this.LOG = this.NOOP;
  }

  public static listen() {
    this.LOG = this._LOG;
  }
}
