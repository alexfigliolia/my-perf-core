import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  verbose: true,
  schema: "./src/GQLClient/Types/graphql-schema.graphql",
  documents: ["src/**/*.gql.ts"],
  generates: {
    "./src/GQLClient/Types/": {
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
