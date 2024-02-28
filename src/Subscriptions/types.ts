import type { Installation, Repository, UserStats } from "@prisma/client";

export type Channels = {
  newInstallation: [identifier: string, payload: Installation];
  newRepositories: [organizationId: number, payload: Repository[]];
  newRepositoryStats: [organizationId: number, payload: Repository];
  newUserStats: [organizationId: number, payload: UserStats[]];
};
