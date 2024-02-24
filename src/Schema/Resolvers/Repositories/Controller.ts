import { GraphQLError } from "graphql";
import type { Repository as GithubWebookRepository } from "@octokit/webhooks-types";
import type { Platform, Prisma } from "@prisma/client";
import type { GithubRepository } from "GQL/PullService";
import { InstallationType } from "GQL/PullService";
import { ORM } from "ORM";
import { InstallationController } from "Schema/Resolvers/Installation/Controller";
import { PullController } from "Schema/Resolvers/Pulls/Controller";
import type { ICreatePull } from "Schema/Resolvers/Pulls/types";
import { Transforms } from "./Transforms";
import type { IRepositoryQuery, IResumeGithubPull, NewOrg } from "./types";

export class RepositoryController {
  public static async pullGithub(org: NewOrg, githubToken: string) {
    const installation = org.installations.find(v => v.platform === "github");
    if (!installation) {
      throw new GraphQLError(
        `A github installation was not found for ${org.name}`,
      );
    }
    const { id, name } = org;
    if (installation.type === "individual") {
      await this.pullGithubRepositories({
        id,
        name,
        token: githubToken,
        type: InstallationType.Individual,
      });
    } else if (installation.type === "organization") {
      const token = await InstallationController.currentToken(installation.id);
      await this.pullGithubRepositories({
        id,
        name,
        token: token,
        type: InstallationType.Organization,
      });
    }
  }

  public static async resumeInProgressPull({
    organizationId,
    jobId,
    token,
  }: IResumeGithubPull) {
    const { status, repos } = await PullController.resumeGithubPull({
      id: jobId,
      token,
    });
    if (repos.length) {
      await this.storeGithubRepoList(repos, organizationId);
    }
    return status;
  }

  private static async pullGithubRepositories(args: ICreatePull) {
    const { status, repos } = await PullController.createGithubPull(args);
    if (repos.length) {
      await this.storeGithubRepoList(repos, args.id);
    }
    return status;
  }

  private static async storeGithubRepoList(
    repos: GithubRepository[],
    organizationId: number,
  ) {
    const existing = await this.findBatch(
      repos.map(v => v.id),
      "github",
    );
    const updates: GithubRepository[] = [];
    const creates: GithubRepository[] = [];
    for (const repo of repos) {
      if (existing.has(repo.id)) {
        updates.push(repo);
      } else {
        creates.push(repo);
      }
    }
    return Promise.allSettled([
      ...updates.map(repo =>
        this.updateGithubRepository(existing.get(repo.id)!, repo),
      ),
      this.createGithubBatch(creates, organizationId),
    ]);
  }

  public static async createGithubRepository(
    repo: GithubWebookRepository,
    organizationId: number,
  ) {
    return ORM.query(
      ORM.repository.create({
        data: {
          organizationId,
          ...Transforms.githubWebhookTransform(repo),
        },
      }),
    );
  }

  public static updateGithubRepository(id: number, repo: GithubRepository) {
    return ORM.query(
      ORM.repository.update({
        where: { id },
        data: Transforms.githubTransform(repo),
      }),
    );
  }

  private static async findBatch(platform_ids: number[], platform: Platform) {
    const found = new Map<number, number>();
    const repos = await ORM.query(
      ORM.repository.findMany({
        where: {
          AND: [
            { platform },
            {
              platform_id: {
                in: platform_ids,
              },
            },
          ],
        },
      }),
    );
    if (repos) {
      for (const { id, platform_id } of repos) {
        found.set(platform_id, id);
      }
    }
    return found;
  }

  public static async createGithubBatch(
    repos: GithubRepository[],
    organizationId: number,
  ) {
    return ORM.query(
      ORM.repository.createMany({
        data: repos.map(repo => ({
          organizationId,
          ...Transforms.githubTransform(repo),
        })),
      }),
    );
  }

  public static deleteGithubRepository(id: number) {
    return ORM.query(
      ORM.repository.delete({
        where: {
          platform_id_platform: {
            platform: "github",
            platform_id: id,
          },
        },
      }),
    );
  }

  public static async updateGithubRepositoryByPlatformID(
    repo: GithubWebookRepository,
  ) {
    return ORM.query(
      ORM.repository.update({
        where: {
          platform_id_platform: {
            platform: "github",
            platform_id: repo.id,
          },
        },
        data: Transforms.githubWebhookTransform(repo),
      }),
    );
  }

  public static getAvailableRepositories({
    offset = 0,
    limit = 30,
    sort = "updated_at",
    search,
    organizationId,
  }: IRepositoryQuery) {
    let where: Prisma.RepositoryFindManyArgs["where"] = { organizationId };
    if (search) {
      where = {
        AND: [
          where,
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          },
        ],
      };
    }
    return ORM.repository.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        [sort]: "desc",
      },
    });
  }
}
