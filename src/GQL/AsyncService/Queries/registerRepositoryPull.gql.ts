import { gql } from "graphql-request";

export const registerRepositoryPull = gql`
  mutation registerRepositoryPull(
    $token: String!
    $api_url: String!
    $platform: Platform!
    $organizationId: Int!
    $requestMethod: RequestMethod!
  ) {
    registerRepositoryPull(
      token: $token
      api_url: $api_url
      platform: $platform
      organizationId: $organizationId
      requestMethod: $requestMethod
    )
  }
`;
