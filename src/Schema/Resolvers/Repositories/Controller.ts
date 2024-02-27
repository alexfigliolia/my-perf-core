import type { Repository as WebHookRepository } from "@octokit/webhooks-types";
import type { Prisma } from "@prisma/client";
import { ORM } from "ORM";
import { Transforms } from "./Transforms";
import type {
  IAvailableRepositories,
  ISetRepositories,
  ITrackedRepositories,
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

  public static trackedRepositories({ organizationId }: ITrackedRepositories) {
    return ORM.query(
      ORM.repository.findMany({
        where: {
          AND: [{ organizationId }, { tracked: true }],
        },
      }),
    );
  }

  public static trackRepository(id: number) {
    return ORM.query(
      ORM.repository.update({
        where: {
          id,
        },
        data: {
          tracked: true,
        },
      }),
    );
  }

  public static async createMany({
    organizationId,
    repositories,
  }: ISetRepositories) {
    if (!repositories.length) {
      return [];
    }
    const results = await ORM.query(
      ORM.$transaction([
        ORM.repository.createMany({
          skipDuplicates: true,
          data: repositories.map(repo => ({
            ...repo,
            language: repo.language || "",
            description: repo.description || "",
          })),
        }),
        ORM.repository.findMany({
          where: {
            organizationId,
          },
        }),
      ]),
    );
    if (!results) {
      return [];
    }
    return results[1];
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
