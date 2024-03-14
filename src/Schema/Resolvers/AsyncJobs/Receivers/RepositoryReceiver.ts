import { ORM } from "ORM";
import type { ISetRepositories } from "../types";

export class RepositoryReceiver {
  public async indexRepositories({
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
}
