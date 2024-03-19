import type { IPullRequestEntry } from "Schema/Resolvers/AsyncJobs/types";

export interface IIndexPRs {
  repositoryId: number;
  pullRequests: IPullRequestEntry[];
  emailToUserID: Map<string, number>;
}
