import { hash } from "bcrypt";
import { UserRole } from "@prisma/client";
import { DB } from "DB/Client";
import type { IOnBoard } from "./types";

export class Controller {
  public static readonly SALTS = 10;

  public static async onboard(params: IOnBoard) {
    const owner = await this.createOwner(params);
    const org = await this.createOrganization(params, owner.id);
    const user = await this.createOrFindUser(params, org.id);
    const role = await this.createOwnerRole(org.id, user.id);
    await this.affiliateOwner(params.email, user.id);
    return this.addRoleToUser(user.id, role.id);
  }

  private static createOwner({ email }: IOnBoard) {
    return DB.organizationOwner.create({
      data: {
        email,
      },
    });
  }

  private static createOrganization(
    { organizationName, platform }: IOnBoard,
    ownerID: number,
  ) {
    return DB.organization.create({
      data: {
        platform,
        name: organizationName,
        organizationOwnerId: ownerID,
      },
    });
  }

  private static async createOrFindUser(
    { username, email, password }: IOnBoard,
    organizationId: number,
  ) {
    const user = await DB.user.findUnique({
      where: { email },
    });
    if (user) {
      return user;
    }
    return DB.user.create({
      data: {
        email,
        name: username,
        organizationId,
        password: await hash(password, this.SALTS),
      },
    });
  }

  private static createOwnerRole(orgID: number, userID: number) {
    return DB.role.create({
      data: {
        userId: userID,
        type: UserRole.admin,
        organizationId: orgID,
      },
    });
  }

  private static affiliateOwner(email: string, userID: number) {
    return DB.organizationOwner.update({
      where: {
        email,
      },
      data: {
        userId: userID,
      },
    });
  }

  private static addRoleToUser(id: number, roleID: number) {
    return DB.user.update({
      where: {
        id,
      },
      data: {
        role: {
          connect: {
            id: roleID,
          },
        },
      },
      include: {
        role: true,
      },
    });
  }
}
