import { gql } from "graphql-request";

export const resumeGithubPull = gql`
  mutation resumeGithubPull($id: Int!, $token: String!) {
    resumeGithubPull(id: $id, token: $token) {
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
