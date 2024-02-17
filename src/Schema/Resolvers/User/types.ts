import type { Platform, Role } from "@prisma/client";

export interface IBaseUser {
  id: number;
  name: string;
}

export interface IUserAndAffiliations {
  name: string;
  id: number;
  organization: {
    name: string;
    id: number;
    roles: {
      role: Role;
    }[];
    platform: Platform;
  }[];
  github: {
    token: string;
  } | null;
}
