import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import type { Prisma } from "@prisma/client";
import { ORM } from "ORM";
import type { ICreateTeam, ISearchTeams } from "./types";

export class TeamsController {
  public static async count(organizationId: number) {
    try {
      const count = await ORM.team.count({ where: { organizationId } });
      return count;
    } catch (error) {
      throw Errors.createError(
        "NOT_FOUND",
        "Organization not found",
        error as Error,
      );
    }
  }

  public static async create(
    userId: number,
    { name, organizationId }: ICreateTeam,
  ) {
    const team = await ORM.query(
      ORM.team.create({
        data: {
          name,
          organizationId,
          users: {
            connect: {
              id: userId,
            },
          },
          roles: {
            create: {
              userId,
              role: "admin",
              organizationId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              name: true,
            },
          },
          roles: {
            where: {
              userId,
            },
            select: {
              role: true,
            },
          },
          projects: {
            select: {
              repository: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    );
    if (!team) {
      throw new GraphQLError("Failed to create a new team");
    }
    const { roles, ...rest } = team;
    return { ...rest, role: roles[0] };
  }

  public static async listUserTeams(userId: number, organizationId: number) {
    const teams = await ORM.query(
      ORM.team.findMany({
        where: {
          AND: [{ organizationId }, { users: { some: { id: userId } } }],
        },
        select: {
          id: true,
          name: true,
          roles: {
            select: {
              role: true,
            },
          },
          users: {
            select: {
              id: true,
              name: true,
            },
          },
          projects: {
            select: {
              repository: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    );
    if (!teams) {
      throw new GraphQLError("Unexpected Error");
    }
    return teams.map(team => {
      const { roles, ...rest } = team;
      return { ...rest, role: roles[0] };
    });
  }

  public static list({
    userId,
    limit = 30,
    search = "",
    offset = 0,
    organizationId,
    omitCurrentUser = false,
  }: ISearchTeams) {
    const clauses: Prisma.TeamWhereInput[] = [{ organizationId }];
    if (search?.length) {
      clauses.push({
        name: {
          contains: search,
          mode: "insensitive",
        },
      });
    }
    if (omitCurrentUser) {
      clauses.push({
        users: {
          none: {
            id: userId,
          },
        },
      });
    }
    return ORM.query(
      ORM.team.findMany({
        where: {
          AND: clauses,
        },
        skip: offset,
        take: limit,
        orderBy: {
          name: "desc",
        },
        select: {
          id: true,
          name: true,
          roles: {
            select: {
              role: true,
            },
          },
          users: {
            select: {
              id: true,
              name: true,
            },
          },
          projects: {
            select: {
              repository: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    );
  }
}
