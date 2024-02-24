import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  verbose: true,
  generates: {
    "./src/GQL/PullService/Types/": {
      documents: ["src/GQL/PullService/Queries/*.gql.ts"],
      schema: "./src/GQL/PullService/Types/graphql-schema.graphql",
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },
    "./src/GQL/StatsService/Types/": {
      documents: ["src/GQL/StatsService/Queries/*.gql.ts"],
      schema: "./src/GQL/StatsService/Types/graphql-schema.graphql",
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
