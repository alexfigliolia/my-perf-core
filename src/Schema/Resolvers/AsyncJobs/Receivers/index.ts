import { RepositoryReceiver } from "./RepositoryReceiver";
import { RepositoryStatsReceiver } from "./RepositoryStatsReceiver";

export class Receivers {
  public static Stats = new RepositoryStatsReceiver();
  public static Repositories = new RepositoryReceiver();
}
