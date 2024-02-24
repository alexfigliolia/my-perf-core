import { ORM } from "ORM";
import type { GenericEmail } from "./types";

export class EmailController {
  public static create<E extends GenericEmail>(userId: number, email: E) {
    return ORM.query(
      ORM.email.create({
        data: {
          userId,
          name: email.email,
          primary: email.primary || false,
          verified: email.verified || false,
        },
      }),
    );
  }
}
