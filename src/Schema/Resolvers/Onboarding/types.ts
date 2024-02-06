import type { Platform } from "@prisma/client";

export interface IOnBoard {
  organizationName: string;
  platform: Platform;
  username: string;
  email: string;
  password: string;
}
