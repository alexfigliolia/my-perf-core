import type { IByOrganization } from "Schema/Resolvers/Organization/types";
import type { StatsPerRepo } from "Schema/Resolvers/Repositories/types";

export interface IDAndName {
  id: number;
  name: string;
}

export interface ITeamScope extends IDAndName {
  users: StatsPerUser[];
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
  linesPerMonth: number[];
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

export interface TeamProfile extends StatsPerRepo {
  id: number;
  name: string;
  linesPerMonth: number[];
}

export interface TeamProfilesPerUser extends StatsPerRepo, IDAndName {
  teams: TeamProfile[];
}

export interface StatsPerTeam {
  id: number;
  name: string;
  projects: {
    repository: {
      monthlyUserStats: MonthlyStatsPerRepo[];
      userStats: StatsPerRepo[];
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
