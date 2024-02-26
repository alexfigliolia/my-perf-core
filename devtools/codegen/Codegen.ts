import { writeFileSync } from "fs";
import path from "path";
import { ChildProcess } from "@figliolia/child-process";
import { Environment } from "../../src/Environment";

export class CodeGen {
  private static readonly Schemas = [
    { url: Environment.ASYNC_SERVICE_URL, types: "src/GQL/AsyncService/Types" },
  ] as const;

  public static async run() {
    await this.getSchemas();
    await this.generateTypes();
    this.fixEntryPoints();
    await this.lint();
  }

  private static async getSchemas() {
    for (const { url, types } of this.Schemas) {
      await new ChildProcess(
        `npx -p @apollo/rover rover graph introspect ${url}/graphql --output ${this.schemaPath(types)} --insecure-accept-invalid-certs`,
      ).handler;
    }
  }

  private static generateTypes() {
    return new ChildProcess(`graphql-codegen`).handler;
  }

  private static fixEntryPoints() {
    for (const { types } of this.Schemas) {
      writeFileSync(this.typesEntrypoint(types), 'export * from "./graphql";');
    }
  }

  private static async lint() {
    for (const { types } of this.Schemas) {
      await new ChildProcess(`npx eslint --fix --ext .ts ${types}`).handler;
    }
  }

  private static schemaPath(directory: string) {
    return path.resolve(process.cwd(), `${directory}/graphql-schema.graphql`);
  }

  private static typesEntrypoint(directory: string) {
    return path.resolve(process.cwd(), `${directory}/index.ts`);
  }
}
