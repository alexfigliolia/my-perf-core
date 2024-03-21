import type { IByOrganization } from "Schema/Resolvers/Organization/types";
import type { IPullRequest } from "Schema/Resolvers/PullRequests/types";
import type { StatsPerRepo } from "Schema/Resolvers/Repositories/types";

export interface IDAndName {
  id: number;
  name: string;
}

export interface ITeamScope extends IDAndName {
  users: StatsPerUser[];
  projects: { repository: StatsPerRepo }[];
}

export interface ITeamProject extends IDAndName {
  date: Date;
}

export interface ITeamProjectTrend {
  trend: number;
  trackedProjects: IDAndName[];
}

export interface StatsPerUser {
  id: number;
  name: string;
  overallStats: StatsPerRepo[];
  pullRequests: { id: number }[];
  monthlyStats: MonthlyStatsPerRepo[];
}

export interface MonthlyStatsPerRepo extends StatsPerRepo {
  date: Date;
}

export interface StatsPerMonth {
  id: number;
  name: string;
  monthlyStats: {
    date: Date;
    lines: number;
  }[];
}

export interface Standout extends IDAndName {
  lines: number;
  increase: number;
}

export interface StatsEntry extends StatsPerRepo, IDAndName {
  pullRequests: number;
  linesPerMonth: number[];
}

export interface ITeammateProfile extends StatsPerRepo, IDAndName {
  linesPerMonth: number[];
  pullRequests: IPullRequest[];
}

export interface TeamStats extends IDAndName {
  lineTrend: number;
  totalLines: number;
  commitTrend: number;
  totalCommits: number;
  users: StatsEntry[];
}

export interface IByTeam extends IByOrganization {
  teamId: number;
}

export interface IByTeammate extends IByOrganization {
  userId: number;
}

export interface IUserProfile {
  id: number;
  name: string;
  organizations: IDAndName[];
  overallStats: StatsPerRepo[];
  pullRequests: RawProfilePR[];
  meshWith: {
    user: StatsPerUser & {
      teams: LinesPerTeam[];
    };
  }[];
  monthlyStats: MonthlyStatsPerRepo[];
}

export interface LinesPerTeam {
  projects: {
    repository: {
      lines: number;
    };
  }[];
}

export interface MeshEntry {
  count: number;
  user: IDAndName;
  toUser: IDAndName;
}

export interface ITeamMesh {
  key: string[];
  mesh: number[][];
}

export interface RawPRList {
  id: number;
  date: Date;
  description: string;
  user: {
    name: string;
  };
  repository: {
    name: string;
  };
}

export interface RawProfilePR {
  id: number;
  date: Date;
  description: string;
  repository: {
    name: string;
  };
}

export interface IGetPRs extends IByTeam {
  page?: number;
}
