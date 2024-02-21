import { writeFileSync } from "fs";
import path from "path";
import { ChildProcess } from "@figliolia/child-process";

export class CodeGen {
  private static readonly SCHEMA_URL = "https://localhost:5001";
  private static readonly TYPES_DIRECTORY = "src/GQLClient/Types";
  public static async run() {
    await this.getSchema();
    await this.generateTypes();
    this.fixEntryPoint();
    await this.lint();
  }

  private static getSchema() {
    return new ChildProcess(
      `npx -p @apollo/rover rover graph introspect ${this.SCHEMA_URL}/graphql --output ${this.schemaPath} --insecure-accept-invalid-certs`,
    ).handler;
  }

  private static generateTypes() {
    return new ChildProcess(`graphql-codegen`).handler;
  }

  private static fixEntryPoint() {
    writeFileSync(
      this.typesEntrypoint,
      ['export * from "./gql";', 'export * from "./graphql";'].join("\n"),
    );
  }

  private static lint() {
    return new ChildProcess(
      `npx eslint --fix --ext .ts ${this.TYPES_DIRECTORY}`,
    ).handler;
  }

  private static get schemaPath() {
    return path.resolve(
      process.cwd(),
      `${this.TYPES_DIRECTORY}/graphql-schema.graphql`,
    );
  }

  private static get typesEntrypoint() {
    return path.resolve(process.cwd(), `${this.TYPES_DIRECTORY}/index.ts`);
  }
}
