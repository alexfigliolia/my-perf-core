import type {
  IMesh,
  IPullRequestEntry,
  IUserStats,
} from "Schema/Resolvers/AsyncJobs/types";

export interface IIndexMesh {
  mesh: IMesh;
  organizationId: number;
  emailToUserID: Map<string, number>;
}

export interface IIndexPRs {
  repositoryId: number;
  pullRequests: IPullRequestEntry[];
  emailToUserID: Map<string, number>;
}

export interface IIndexStatsPerRepo {
  stats: IUserStats[];
  repositoryId: number;
  organizationId: number;
  emailToUserID: Map<string, number>;
}
