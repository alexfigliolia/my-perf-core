import type { IByOrganization } from "Schema/Resolvers/Organization/types";
import type { StatsPerRepo } from "Schema/Resolvers/Repositories/types";

export interface TrackedProject {
  id: number;
  name: string;
}

export interface ITeamScope extends TrackedProject {
  users: StatsPerUser[];
  projects: ITeamProject[];
}

export interface ITeamProject {
  date: Date;
  repository: TrackedProject;
}

export interface ITeamProjectTrend {
  trend: number;
  trackedProjects: TrackedProject[];
}

export interface StatsPerUser {
  id: number;
  name: string;
  overallStats: StatsPerRepo[];
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

export interface Standout extends TrackedProject {
  lines: number;
  increase: number;
}

export interface StatsEntry extends StatsPerRepo, TrackedProject {
  linesPerMonth: number[];
}

export interface TeamStats extends TrackedProject {
  lineTrend: number;
  totalLines: number;
  commitTrend: number;
  totalCommits: number;
  users: StatsEntry[];
}

export interface IByTeam extends IByOrganization {
  teamId: number;
}
