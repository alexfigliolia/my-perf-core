import { GraphQLError } from "graphql";
import { UserRole } from "@prisma/client";
import { DB } from "DB";
import { Errors } from "Errors";
import { SmartPunctuation } from "Sanitizers";
import type { ICreateOrganization } from "./types";

export class OrganizationController {
  public static async create({ name, ownerID }: ICreateOrganization) {
    const orgName = SmartPunctuation.sanitizeInput(name);
    if (await this.findConflictingOrgs(orgName, ownerID)) {
      this.conflictingOrganizationError(name);
    }
    const org = await this.createOrganization(orgName, ownerID);
    await this.createOwnership(ownerID, org.id);
    return org;
  }

  private static createOrganization(name: string, ownerID: number) {
    return DB.organization.create({
      data: {
        name,
        users: {
          connect: {
            id: ownerID,
          },
        },
      },
    });
  }

  private static async createOwnership(ownerID: number, orgID: number) {
    return Promise.all([
      DB.owner.create({
        data: {
          userId: ownerID,
          organizationId: orgID,
        },
      }),
      DB.role.create({
        data: {
          userId: ownerID,
          type: UserRole.admin,
          organizationId: orgID,
        },
      }),
    ]);
  }

  private static async findConflictingOrgs(name: string, userID: number) {
    return DB.organization.findFirst({
      where: {
        name,
        users: {
          some: {
            id: userID,
          },
        },
      },
    });
  }

  private static conflictingOrganizationError(name: string) {
    throw new GraphQLError(
      `You are already affiliated with an organization named "${name}"`,
      {
        extensions: Errors.BAD_REQUEST,
      },
    );
  }
}
