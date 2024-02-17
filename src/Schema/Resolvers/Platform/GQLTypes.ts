import { GraphQLEnumType } from "graphql";

export const PlatformType = new GraphQLEnumType({
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
