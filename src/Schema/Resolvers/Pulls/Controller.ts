import { pullGithubRepositories, resumeGithubPull } from "GQLClient";
import type {
  PullGithubRepositoriesMutation,
  PullGithubRepositoriesMutationVariables,
  ResumeGithubPullMutation,
  ResumeGithubPullMutationVariables,
} from "GQLClient/Types";
import { Platform, Status } from "GQLClient/Types";
import { JobServiceRequest } from "JobService/Request";
import { ORM } from "ORM/ORM";
import type { ICreatePull, IResumePull, PullIdentifiers } from "./types";

export class PullController {
  public static async createGithubPull({ id, name, type, token }: ICreatePull) {
    const response = await JobServiceRequest<
      PullGithubRepositoriesMutation,
      PullGithubRepositoriesMutationVariables
    >({
      query: pullGithubRepositories,
      variables: {
        id,
        name,
        type,
        token,
        platform: Platform.Github,
      },
    });
    const { status, repos, jobId } = response.data.pullGithubRepositories;
    if (status === Status.Incomplete) {
      await this.indexIncompletePull(jobId, id, Platform.Github);
    }
    return { status, repos };
  }

  public static async resumeGithubPull({ id, token }: IResumePull) {
    const response = await JobServiceRequest<
      ResumeGithubPullMutation,
      ResumeGithubPullMutationVariables
    >({
      query: resumeGithubPull,
      variables: {
        id,
        token,
      },
    });
    const { status, repos, jobId } = response.data.resumeGithubPull;
    if (status === Status.Complete) {
      await this.deleteByJobID(jobId);
    }
    return { status, repos };
  }

  private static async indexIncompletePull(
    jobId: number,
    ...args: PullIdentifiers
  ) {
    const existing = await this.findByOrganization(...args);
    if (!existing) {
      return this.create(jobId, ...args);
    }
  }

  public static create(jobId: number, ...args: PullIdentifiers) {
    const [organizationId, platform] = args;
    return ORM.query({
      transaction: DB => {
        return DB.pull.create({
          data: {
            jobId,
            platform,
            organizationId,
          },
        });
      },
      onResult: data => data,
      onError: () => {},
    });
  }

  public static deleteByJobID(jobId: number) {
    return ORM.query({
      transaction: DB => {
        return DB.pull.delete({
          where: { jobId },
        });
      },
      onResult: data => data,
      onError: () => {},
    });
  }

  private static findByOrganization(...args: PullIdentifiers) {
    const [organizationId, platform] = args;
    return ORM.query({
      transaction: DB => {
        return DB.pull.findFirst({
          where: {
            AND: [{ organizationId }, { platform }],
          },
        });
      },
      onResult: data => data,
      onError: () => {},
    });
  }
}
