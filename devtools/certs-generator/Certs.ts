import { ChildProcess } from "@figliolia/child-process";

export class Certs {
  private static readonly outDirectory = "./cert";
  private static readonly keyFile = `${this.outDirectory}/server.key`;
  private static readonly certFile = `${this.outDirectory}/server.cert`;
  private static readonly subject =
    "/C=US/ST=State/L=City/O=company/OU=Com/CN=www.testserver.local";

  public static async run() {
    await this.detectOpenSSL();
    const CP = new ChildProcess(
      `openssl req  -nodes -new -x509 -keyout ${this.keyFile} -out ${this.certFile} -subj "${this.subject}"`,
      { shell: "/bin/bash" },
    );
    await CP.handler;
  }

  private static async detectOpenSSL() {
    try {
      const { stderr } = await ChildProcess.execute("which openssl");
      if (stderr) {
        throw new Error("Missing SSL");
      }
    } catch (error) {
      const chalk = require("chalk");
      console.log(
        chalk.redBright.bold("Installation Error:"),
        "Please install 'openssl' on your local machine",
      );
      process.exit(0);
    }
  }
}
