import { OAuth } from "./OAuth";
import { WebHooks } from "./Webooks";

export class Github {
  public static OAuth = new OAuth();
  public static Webooks = new WebHooks();
}
