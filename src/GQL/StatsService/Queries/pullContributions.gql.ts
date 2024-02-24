import { gql } from "graphql-request";

export const pullContributions = gql`
  mutation pullContributions(
    $token: String!
    $clone_url: String!
    $emails: [String!]!
  ) {
    pullContributions(token: $token, clone_url: $clone_url, emails: $emails) {
      users {
        name
        email
        lines
        commits
      }
      totalLines
      totalCommits
    }
  }
`;
