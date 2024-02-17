import type { Organization } from "@prisma/client";

export type Channels = {
  newOrganization: [installation_id: number, payload: Organization];
};
