export interface StatsPerUser {
  id: number;
  name: string;
  overallStats: StatsPerRepo[];
  monthlyStats: MonthlyStatsPerRepo[];
}

export interface StatsPerRepo {
  lines: number;
  commits: number;
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

export interface Standout {
  id: number;
  name: string;
  lines: number;
  increase: number;
}

export interface StatsEntry extends StatsPerRepo {
  id: number;
  name: string;
  linesPerMonth: number[];
}

export interface TeamStats {
  totalLines: number;
  totalCommits: number;
  users: StatsEntry[];
}
