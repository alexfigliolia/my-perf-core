import { subMonths } from "date-fns";
import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import { ORM } from "ORM";
import { RepositoryController } from "Schema/Resolvers/Repositories/Controller";
import { Transforms } from "./Transforms";
import type { IByTeam, IByTeammate, IGetPRs } from "./types";

export class TeamController {
  public static async overallStatsPerUser({ organizationId, teamId }: IByTeam) {
    const repos = await this.getTrackedRepositories(teamId);
    const IDs = repos.map(repo => repo.id);
    const stats = await ORM.query(
      ORM.team.findUnique({
        where: {
          id_organizationId: {
            id: teamId,
            organizationId,
          },
        },
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
              name: true,
              overallStats: {
                where: {
                  AND: [{ organizationId }, { repositoryId: { in: IDs } }],
                },
                select: {
                  lines: true,
                  commits: true,
                },
              },
              monthlyStats: {
                where: {
                  AND: [
                    { organizationId },
                    {
                      date: {
                        gte: subMonths(new Date(), 12).toISOString(),
                      },
                    },
                    { repositoryId: { in: IDs } },
                  ],
                },
                select: {
                  date: true,
                  lines: true,
                  commits: true,
                },
              },
              pullRequests: {
                where: {
                  repositoryId: { in: IDs },
                },
                select: {
                  id: true,
                },
              },
            },
          },
          projects: {
            select: {
              repository: {
                select: {
                  lines: true,
                  commits: true,
                },
              },
            },
          },
        },
      }),
    );
    if (!stats) {
      throw Errors.createError(
        "NOT_FOUND",
        "This organization's users were not found",
      );
    }
    return Transforms.parseTeamStats(stats, repos);
  }

  public static async getStandouts({ organizationId, teamId }: IByTeam) {
    const stats = await ORM.query(
      ORM.team.findUnique({
        where: {
          id_organizationId: {
            id: teamId,
            organizationId,
          },
        },
        select: {
          users: {
            select: {
              id: true,
              name: true,
              monthlyStats: {
                where: {
                  AND: [
                    { organizationId },
                    { date: { gte: subMonths(new Date(), 2).toISOString() } },
                  ],
                },
                select: {
                  date: true,
                  lines: true,
                },
              },
            },
          },
        },
      }),
    );
    if (!stats) {
      throw new GraphQLError("This organization's users were not found");
    }
    return Transforms.calculateContributionDeltas(stats.users);
  }

  public static async getTrackedRepositories(teamId: number) {
    const tracked = await ORM.query(
      ORM.trackedRepository.findMany({
        where: {
          teamId,
        },
        select: {
          date: true,
          repository: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    );
    if (!tracked) {
      throw Errors.createError(
        "NOT_FOUND",
        "The current team's projects were not found. Please try again",
      );
    }
    return tracked.map(t => ({
      date: t.date,
      id: t.repository.id,
      name: t.repository.name,
    }));
  }

  public static async getTeammateStats(args: IByTeammate) {
    const user = await this.getUserStats(args);
    if (!user || !user.organizations.length) {
      throw Errors.createError(
        "NOT_FOUND",
        "There were no team affiliations found. Please try again",
      );
    }
    return Transforms.parseIndividualUserStats(user);
  }

  private static async getUserStats({ userId, organizationId }: IByTeammate) {
    const stats = await ORM.query(
      ORM.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          meshWith: {
            where: {
              organizationId,
            },
            take: 4,
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  overallStats: {
                    where: {
                      organizationId,
                    },
                    select: {
                      lines: true,
                      commits: true,
                    },
                  },
                  monthlyStats: {
                    where: {
                      AND: [
                        { organizationId },
                        {
                          date: { gte: subMonths(new Date(), 2).toISOString() },
                        },
                      ],
                    },
                    select: {
                      date: true,
                      lines: true,
                      commits: true,
                    },
                  },
                  teams: {
                    select: {
                      projects: {
                        select: {
                          repository: {
                            select: {
                              lines: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  pullRequests: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
          organizations: {
            where: {
              id: organizationId,
            },
          },
          overallStats: {
            where: {
              organizationId,
            },
            select: {
              lines: true,
              commits: true,
            },
          },
          monthlyStats: {
            where: {
              AND: [
                { organizationId },
                {
                  date: {
                    gte: subMonths(new Date(), 12).toISOString(),
                  },
                },
              ],
            },
            select: {
              date: true,
              lines: true,
              commits: true,
            },
          },
          pullRequests: {
            select: {
              id: true,
              date: true,
              description: true,
              repository: { select: { name: true } },
            },
            orderBy: {
              date: "desc",
            },
            take: 10,
          },
        },
      }),
    );
    if (!stats) {
      Errors.createError(
        "NOT_FOUND",
        "Something went wrong when looking up this user. Please try again",
      );
    }
    return stats;
  }

  public static async getMesh({ teamId, organizationId }: IByTeam) {
    const mesh = await ORM.query(
      ORM.mesh.findMany({
        where: {
          AND: [
            { organizationId },
            {
              user: {
                teams: {
                  some: {
                    id: teamId,
                  },
                },
              },
            },
            {
              toUser: {
                teams: {
                  some: {
                    id: teamId,
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          count: "desc",
        },
        select: {
          count: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    );
    if (!mesh) {
      throw Errors.createError(
        "UNEXPECTED_ERROR",
        "Something went wrong when fetching your collaborators. We're working on it",
      );
    }
    return Transforms.toMesh(mesh);
  }

  public static async getPRs({ teamId, organizationId, page = 1 }: IGetPRs) {
    const [users, projects] = await Promise.all([
      this.getUsers({ teamId, organizationId }),
      RepositoryController.trackedRepositoriesByTeam(teamId),
    ]);
    const userIds = users.map(u => u.id);
    const projectIds = projects.map(p => p.id);
    const results = await ORM.query(
      ORM.pullRequest.findMany({
        where: {
          AND: [
            { userId: { in: userIds } },
            { repositoryId: { in: projectIds } },
          ],
        },
        select: {
          id: true,
          date: true,
          user: {
            select: {
              name: true,
            },
          },
          repository: {
            select: {
              name: true,
            },
          },
          description: true,
        },
        orderBy: {
          date: "desc",
        },
        take: page * 10,
        skip: (page - 1) * 10,
      }),
    );
    if (!results) {
      throw Errors.createError(
        "NOT_FOUND",
        "This team's projects were not found",
      );
    }
    return Transforms.parsePRs(results);
  }

  public static async getUsers({ teamId, organizationId }: IByTeam) {
    const users = await ORM.query(
      ORM.team.findUnique({
        where: {
          id_organizationId: {
            id: teamId,
            organizationId,
          },
        },
        select: {
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    );
    if (!users) {
      throw Errors.createError("NOT_FOUND", "This team was not found");
    }
    return users.users;
  }
}
