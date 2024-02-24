import { gql } from "graphql-request";

export const pullGithubRepositories = gql`
  mutation pullGithubRepositories(
    $id: Int!
    $name: String!
    $platform: Platform!
    $type: InstallationType!
    $token: String!
  ) {
    pullGithubRepositories(
      id: $id
      name: $name
      platform: $platform
      type: $type
      token: $token
    ) {
      jobId
      status
      repos {
        id
        name
        description
        html_url
        clone_url
        language
        url
        created_at
        updated_at
      }
    }
  }
`;
