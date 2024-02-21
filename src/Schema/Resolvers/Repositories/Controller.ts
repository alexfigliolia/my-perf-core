import { GraphQLError } from "graphql";
import type { Platform, Repository } from "@prisma/client";
import { type IGithubRepository } from "Github";
import type { GithubRepository } from "GQLClient/Types";
import { InstallationType } from "GQLClient/Types";
import { ORM } from "ORM";
import { InstallationController } from "Schema/Resolvers/Installation/Controller";
import { PullController } from "Schema/Resolvers/Pulls/Controller";
import type { ICreatePull } from "Schema/Resolvers/Pulls/types";
import type { IResumeGithubPull, NewOrg } from "./types";

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

  public static createGithubRepository(
    repo: IGithubRepository,
    organizationId: number,
  ) {
    return ORM.query({
      transaction: DB => {
        return DB.repository.create({
          data: {
            organizationId,
            name: repo.name,
            api_url: repo.url,
            platform: "github",
            platform_id: repo.id,
            html_url: repo.html_url,
            clone_url: repo.clone_url,
            language: repo.language || undefined,
            description: repo.description || undefined,
          },
        });
      },
      onResult: data => data,
      onError: _ => {},
    });
  }

  public static updateGithubRepository(id: number, repo: GithubRepository) {
    return ORM.query({
      transaction: DB => {
        return DB.repository.update({
          where: { id },
          data: {
            name: repo.name,
            api_url: repo.url,
            platform: "github",
            platform_id: repo.id,
            html_url: repo.html_url,
            clone_url: repo.clone_url,
            language: repo.language || undefined,
            description: repo.description || undefined,
          },
        });
      },
      onResult: data => data,
      onError: _ => {},
    });
  }

  private static async findBatch(platform_ids: number[], platform: Platform) {
    const found = new Map<number, number>();
    await ORM.query({
      transaction: DB => {
        return DB.repository.findMany({
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
        });
      },
      onResult: (data: Repository[]) => {
        for (const { id, platform_id } of data) {
          found.set(platform_id, id);
        }
      },
      onError: () => {},
    });
    return found;
  }

  public static async createGithubBatch(
    repos: GithubRepository[],
    organizationId: number,
  ) {
    return ORM.query({
      transaction: DB => {
        return DB.repository.createMany({
          data: repos.map(repo => ({
            organizationId,
            name: repo.name,
            api_url: repo.url,
            platform: "github",
            platform_id: repo.id,
            html_url: repo.html_url,
            clone_url: repo.clone_url,
            language: repo.language || undefined,
            description: repo.description || undefined,
          })),
        });
      },
      onResult: data => data,
      onError: () => {},
    });
  }
}
