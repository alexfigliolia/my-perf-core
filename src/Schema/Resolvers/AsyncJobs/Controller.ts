import { GraphQLError } from "graphql";
import { AsyncServiceRequest } from "@alexfigliolia/my-performance-clients";
import type { InstallationType, Platform } from "@prisma/client";
import { registerRepositoryPull } from "GQL";
import { registerRepositoryStatsPull } from "GQL/AsyncService";
import type {
  Platform as APlatform,
  RegisterRepositoryPullMutation,
  RegisterRepositoryPullMutationVariables,
  RegisterRepositoryStatsPullMutation,
  RegisterRepositoryStatsPullMutationVariables,
} from "GQL/AsyncService/Types";
import { RequestMethod } from "GQL/AsyncService/Types";
import { ORM } from "ORM";
import { OrganizationController } from "Schema/Resolvers/Organization/Controller";
import type {
  IIndexRepoStats,
  IRegisterRepoStatsPull,
  ISetRepositories,
  NewOrg,
} from "./types";

export class AsyncController {
  public static async registerRepositoryStatsPull(
    args: IRegisterRepoStatsPull,
  ) {
    return AsyncServiceRequest<
      RegisterRepositoryStatsPullMutation,
      RegisterRepositoryStatsPullMutationVariables
    >({
      query: registerRepositoryStatsPull,
      variables: args,
    });
  }

  public static registerRepositoryPull(organization: NewOrg, token: string) {
    const { id, name, installations } = organization;
    return Promise.all(
      installations.map(install => {
        const { platform, type } = install;
        return AsyncServiceRequest<
          RegisterRepositoryPullMutation,
          RegisterRepositoryPullMutationVariables
        >({
          query: registerRepositoryPull,
          variables: {
            token,
            organizationId: id,
            platform: platform as APlatform,
            requestMethod: RequestMethod.Get,
            api_url: this.pullURL(name, platform, type),
          },
        });
      }),
    );
  }

  private static pullURL(
    name: string,
    platform: Platform,
    type: InstallationType,
  ) {
    switch (platform) {
      case "github": {
        if (type === "individual") {
          return "https://api.github.com/user/repos";
        }
        return `https://api.github.com/orgs/${name}/repos`;
      }
      case "bitbucket":
      default: {
        throw new Error("Unimplemented");
      }
    }
  }

  public static async indexRepositories({
    repositories,
    organizationId,
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

  public static async indexRepositoryStats({
    userStats,
    totalLines,
    totalCommits,
    repositoryId,
    organizationId,
  }: IIndexRepoStats) {
    const [allEmails, emailToUserID] =
      await OrganizationController.userEmailList(organizationId);
    if (!allEmails || !emailToUserID) {
      throw new GraphQLError("Organization not found");
    }
    await this.deleteUserStatsForRepository(repositoryId);
    const stats = userStats.filter(stats => allEmails.has(stats.email));
    const repository = await ORM.query(
      ORM.repository.update({
        where: {
          id: repositoryId,
        },
        data: {
          totalLines,
          totalCommits,
          userStats: {
            createMany: {
              data: stats.map(stat => ({
                totalLines: stat.lines,
                totalCommits: stat.commits,
                userId: emailToUserID.get(stat.email)!,
              })),
            },
          },
        },
        include: {
          userStats: true,
        },
      }),
    );
    if (!repository) {
      throw new GraphQLError("Error setting repository stats");
    }
    return repository;
  }

  private static deleteUserStatsForRepository(id: number) {
    return ORM.query(ORM.userStats.deleteMany({ where: { repositoryId: id } }));
  }
}
