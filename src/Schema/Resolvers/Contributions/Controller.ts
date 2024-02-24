import { GraphQLError } from "graphql";
import type { Repository } from "@prisma/client";
import { Errors } from "Errors";
import type {
  PullContributionsMutation,
  PullContributionsMutationVariables,
} from "GQL/StatsService";
import { pullContributions } from "GQL/StatsService";
import { Logger } from "Logger";
import { OrganizationController } from "Schema/Resolvers/Organization/Controller";
import { StatsServiceRequest } from "StatsService/Request";

export class ContributionsController {
  public static async enqueue(repo: Repository, token?: string | null) {
    if (!token) {
      throw new GraphQLError("Unauthorized", {
        extensions: Errors.UNAUTHORIZED,
      });
    }
    const { clone_url, organizationId } = repo;
    const orgUsers = await OrganizationController.allUsers(organizationId);
    if (!orgUsers) {
      throw new GraphQLError("Invalid organization ID");
    }
    const emails = orgUsers.users.flatMap(user => {
      return user.emails.map(email => email.name);
    });
    const stats = await StatsServiceRequest<
      PullContributionsMutation,
      PullContributionsMutationVariables
    >({
      query: pullContributions,
      variables: {
        token,
        emails,
        clone_url,
      },
    });
    Logger.GQL(stats.data.pullContributions);
  }
}
