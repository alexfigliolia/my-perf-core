import { gql } from "graphql-request";

export const deleteRepositoryStatsJobs = gql`
  mutation deleteRepositoryStatsJobs($repositoryId: Int!) {
    deleteRepositoryStatsJobs(repositoryId: $repositoryId)
  }
`;
