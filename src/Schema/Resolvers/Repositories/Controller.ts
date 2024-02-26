import { ORM } from "ORM";
import type { InputRepository } from "./types";

export class RepositoryController {
  public static async saveRepositories(repositories: InputRepository[]) {
    return ORM.query(
      ORM.repository.createMany({
        data: repositories.map(repo => ({
          ...repo,
          language: repo.language || "",
          description: repo.description || "",
        })),
      }),
    );
  }
}
