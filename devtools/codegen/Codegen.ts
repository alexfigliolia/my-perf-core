import { writeFileSync } from "fs";
import path from "path";
import { ChildProcess } from "@figliolia/child-process";

export class CodeGen {
  private static readonly Schemas = [
    { url: "https://localhost:5001", types: "src/GQL/PullService/Types" },
    {
      url: "https://localhost:5002",
      types: "src/GQL/StatsService/Types",
    },
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
      writeFileSync(
        this.typesEntrypoint(types),
        ['export * from "./gql";', 'export * from "./graphql";'].join("\n"),
      );
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
