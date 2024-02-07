import { DB } from "DB";

export class UserController {
  public static async userAndAffiliations(userID: number) {
    const { organizations, ...user } = await this.userScopeQuery(userID);
    return {
      user,
      organizations: organizations.map(org => {
        const { roles, ...rest } = org;
        return {
          ...rest,
          role: roles[0].type,
        };
      }),
    };
  }

  public static userScopeQuery(userID: number) {
    return DB.user.findUniqueOrThrow({
      where: { id: userID },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
        organizations: {
          select: {
            id: true,
            name: true,
            platform: true,
            roles: {
              where: {
                userId: userID,
              },
              select: {
                type: true,
              },
              take: 1,
            },
          },
        },
      },
    });
  }
}
