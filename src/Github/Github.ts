import { Errors, OAuth, Repositories, WebHooks } from "./API";
import { Stream } from "./Stream";

export class Github {
  public static OAuth = new OAuth();
  public static Errors = new Errors();
  public static Webooks = new WebHooks();
  public static Repositories = new Repositories();
  public static Stream = new Stream(this.Webooks.Emitter);
}
