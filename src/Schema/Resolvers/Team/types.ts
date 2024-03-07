export interface StatsPerUser {
  id: number;
  name: string;
  overallStats: StatsPerRepo[];
}

export interface StatsPerRepo {
  lines: number;
  commits: number;
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
}
