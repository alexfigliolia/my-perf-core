import type { Session, SessionData } from "express-session";
import { GraphQLError } from "graphql";
import type { Repository as WebHookRepository } from "@octokit/webhooks-types";
import type { Prisma } from "@prisma/client";
import { ORM } from "ORM";
import { AsyncController } from "Schema/Resolvers/AsyncJobs/Controller";
import { Transforms } from "./Transforms";
import type { IAvailableRepositories, ITrackedRepositories } from "./types";

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

  public static trackedRepositories({ organizationId }: ITrackedRepositories) {
    return ORM.query(
      ORM.repository.findMany({
        where: {
          AND: [{ organizationId }, { tracked: true }],
        },
      }),
    );
  }

  public static async trackRepository(
    repositoryId: number,
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
    const { id, organizationId, platform, clone_url } = repo;
    let token: string;
    if (platform === "github") {
      token = session.githubUserToken as string;
    } else {
      throw new GraphQLError(
        "Tracking bitbucket repositories is not yet implemented",
      );
    }
    void AsyncController.registerRepositoryStatsPull({
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

  public static deleteGithubRepository(id: number) {
    return ORM.query(
      ORM.repository.deleteMany({
        where: {
          AND: [{ platform: "github" }, { platform_id: id }],
        },
      }),
    );
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
}
