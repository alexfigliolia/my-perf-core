import type { Installation, Repository } from "@prisma/client";

export type Channels = {
  newInstallation: [identifier: string, payload: Installation];
  newRepositories: [organizationId: number, payload: Repository[]];
};
