import type {
  PullGithubRepositoriesMutation,
  PullGithubRepositoriesMutationVariables,
  ResumeGithubPullMutation,
  ResumeGithubPullMutationVariables,
} from "GQL/PullService";
import {
  Platform,
  pullGithubRepositories,
  resumeGithubPull,
  Status,
} from "GQL/PullService";
import { ORM } from "ORM";
import { PullServiceRequest } from "PullService/Request";
import type { ICreatePull, IResumePull, PullIdentifiers } from "./types";

export class PullController {
  public static async createGithubPull({ id, name, type, token }: ICreatePull) {
    const response = await PullServiceRequest<
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
    const response = await PullServiceRequest<
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
    return ORM.query(
      ORM.pull.create({
        data: {
          jobId,
          platform,
          organizationId,
        },
      }),
    );
  }

  public static deleteByJobID(jobId: number) {
    return ORM.query(
      ORM.pull.delete({
        where: { jobId },
      }),
    );
  }

  private static findByOrganization(...args: PullIdentifiers) {
    const [organizationId, platform] = args;
    return ORM.query(
      ORM.pull.findFirst({
        where: {
          AND: [{ organizationId }, { platform }],
        },
      }),
    );
  }
}
