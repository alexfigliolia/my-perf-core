import { subMonths } from "date-fns";
import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import { ORM } from "ORM";
import { UserController } from "Schema/Resolvers/User/Controller";
import { Transforms } from "./Transforms";
import type { IByTeam, IByTeammate } from "./types";

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
    const [user, teams] = await Promise.all([
      UserController.getUser(args.userId),
      this.getUserStats(args),
    ]);
    if (!teams || !teams.length) {
      throw Errors.createError(
        "NOT_FOUND",
        "There were no team affiliations found. Please try again",
      );
    }
    return {
      ...user,
      ...Transforms.parseStatsPerTeam(teams),
    };
  }

  private static async getUserStats({ userId, organizationId }: IByTeammate) {
    const stats = await ORM.query(
      ORM.team.findMany({
        where: {
          AND: [{ organizationId }, { users: { some: { id: userId } } }],
        },
        select: {
          id: true,
          name: true,
          projects: {
            select: {
              repository: {
                select: {
                  userStats: {
                    where: {
                      userId,
                    },
                    select: {
                      lines: true,
                      commits: true,
                    },
                  },
                  monthlyUserStats: {
                    where: {
                      AND: [
                        { userId },
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
                },
              },
            },
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
}
