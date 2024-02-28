import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  verbose: true,
  generates: {
    "./src/GQL/AsyncService/Types/": {
      documents: ["src/GQL/AsyncService/Queries/*.gql.ts"],
      schema: "./src/GQL/AsyncService/Types/graphql-schema.graphql",
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
