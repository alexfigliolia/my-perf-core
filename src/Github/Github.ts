import { OAuth } from "./OAuth";
import { Repositories } from "./Repositories";
import { WebHooks } from "./Webooks";

export class Github {
  public static OAuth = new OAuth();
  public static Webooks = new WebHooks();
  public static Repositories = new Repositories();
}
