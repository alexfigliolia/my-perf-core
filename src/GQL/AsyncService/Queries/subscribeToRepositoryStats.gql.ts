import { gql } from "graphql-request";

export const subscribeToRepositoryStats = gql`
  mutation subscribeToRepositoryStats(
    $token: String!
    $clone_url: String!
    $repositoryId: Int!
    $organizationId: Int!
  ) {
    subscribeToRepositoryStats(
      token: $token
      clone_url: $clone_url
      repositoryId: $repositoryId
      organizationId: $organizationId
    )
  }
`;
