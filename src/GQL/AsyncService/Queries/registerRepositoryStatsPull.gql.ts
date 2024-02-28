import { gql } from "graphql-request";

export const registerRepositoryStatsPull = gql`
  mutation registerRepositoryStatsPull(
    $token: String!
    $clone_url: String!
    $repositoryId: Int!
    $organizationId: Int!
  ) {
    registerRepositoryStatsPull(
      token: $token
      clone_url: $clone_url
      repositoryId: $repositoryId
      organizationId: $organizationId
    )
  }
`;
