import type { Installation } from "@prisma/client";

export type Channels = {
  newInstallation: [identifier: string, payload: Installation];
};
