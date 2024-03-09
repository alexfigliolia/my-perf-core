import { gql } from "graphql-request";

export const checkRepositoryPullStatus = gql`
  query checkRepositoryPullStatus($organizationId: Int!) {
    checkRepositoryPullStatus(organizationId: $organizationId)
  }
`;
