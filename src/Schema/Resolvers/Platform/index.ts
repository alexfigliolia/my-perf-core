import { GraphQLEnumType } from "graphql";

export const Platform = new GraphQLEnumType({
  name: "Platform",
  values: {
    github: {
      value: "github",
    },
    bitbucket: {
      value: "bitbucket",
    },
  },
});
