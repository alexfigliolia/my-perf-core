import { Certs } from "./Certs";

(async () => {
  await Certs.run();
})().catch(console.log);
