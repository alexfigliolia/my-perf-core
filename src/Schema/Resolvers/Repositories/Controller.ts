import type { Session, SessionData } from "express-session";
import { GraphQLError } from "graphql";
import { Errors } from "@alexfigliolia/my-performance-gql-errors";
import type { Repository as WebHookRepository } from "@octokit/webhooks-types";
import type { Prisma } from "@prisma/client";
import { ORM } from "ORM";
import { AsyncController } from "Schema/Resolvers/AsyncJobs/Controller";
import { Transforms } from "./Transforms";
import type {
  IAvailableRepositories,
  IByRepository,
  ITotalRepos,
} from "./types";

export class RepositoryController {
  public static list({
    sort,
    limit = 30,
    search = "",
    offset = 0,
    organizationId,
  }: IAvailableRepositories) {
    const clauses: Prisma.RepositoryWhereInput[] = [{ organizationId }];
    if (search?.length) {
      clauses.push({
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      });
    }
    return ORM.query(
      ORM.repository.findMany({
        where: {
          AND: clauses,
        },
        skip: offset,
        take: limit,
        orderBy: {
          [sort || "updated_at"]: "desc",
        },
      }),
    );
  }

  public static async trackedRepositoriesByTeam(id: number) {
    const tracked = await ORM.trackedRepository.findMany({
      where: {
        teamId: id,
      },
      select: {
        repository: true,
      },
    });
    return tracked.map(project => project.repository);
  }

  public static trackedRepositoriesByOrganization(id: number) {
    return ORM.repository.findMany({
      where: {
        AND: [{ organizationId: id }, { tracked: true }],
      },
    });
  }

  public static async trackRepository(
    { teamId, repositoryId, organizationId }: IByRepository,
    session: Session & Partial<SessionData>,
  ) {
    const repo = await ORM.query(
      ORM.repository.update({
        where: {
          id: repositoryId,
        },
        data: {
          tracked: true,
        },
      }),
    );
    if (!repo) {
      throw new GraphQLError("Failed to update repository");
    }
    await ORM.trackedRepository.create({
      data: {
        teamId,
        repositoryId,
      },
    });
    const { id, platform, clone_url } = repo;
    let token: string;
    if (platform === "github") {
      token = session.githubUserToken as string;
    } else {
      throw new GraphQLError(
        "Tracking bitbucket repositories is not yet implemented",
      );
    }
    void AsyncController.subscribeToRepositoryStats({
      token,
      clone_url,
      organizationId,
      repositoryId: id,
    });
    return repo;
  }

  public static createFromWebhook(
    repo: WebHookRepository,
    organizationId: number,
  ) {
    return ORM.query(
      ORM.repository.create({
        data: {
          organizationId,
          ...Transforms.githubTransform(repo),
        },
      }),
    );
  }

  public static async deleteGithubRepository(id: number) {
    const [repos] = await ORM.$transaction([
      ORM.repository.findMany({
        where: {
          AND: [{ platform: "github" }, { platform_id: id }],
        },
      }),
      ORM.repository.deleteMany({
        where: {
          AND: [{ platform: "github" }, { platform_id: id }],
        },
      }),
    ]);
    for (const repo of repos) {
      if (repo.tracked) {
        void AsyncController.deleteRepositoryStatsJobs(repo.id);
      }
    }
  }

  public static updateFromWebhook(repo: WebHookRepository) {
    return ORM.query(
      ORM.repository.updateMany({
        where: {
          AND: [{ platform: "github" }, { platform_id: repo.id }],
        },
        data: Transforms.githubTransform(repo),
      }),
    );
  }

  public static async count({ organizationId, tracked }: ITotalRepos) {
    let where: Prisma.RepositoryWhereInput;
    if (!tracked) {
      where = { organizationId };
    } else {
      where = {
        AND: [{ organizationId }, { tracked: true }],
      };
    }
    return ORM.repository.count({ where }).catch(error => {
      throw Errors.createError(
        "UNEXPECTED_ERROR",
        "Something went wrong when counting your projects",
        error,
      );
    });
  }

  public static async countLinesAndCommits(organizationId: number) {
    const data = await ORM.query(
      ORM.repository.findMany({
        where: {
          AND: [{ organizationId }, { tracked: true }],
        },
        select: {
          lines: true,
          commits: true,
        },
      }),
    );
    if (!data) {
      throw Errors.createError(
        "NOT_FOUND",
        "There was an error obtaining this organization's projects. Please try again",
      );
    }
    let lines = 0;
    let commits = 0;
    for (const project of data) {
      lines += project.lines;
      commits += project.commits;
    }
    return {
      lines,
      commits,
      totalProjects: data.length,
    };
  }
}
