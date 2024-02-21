import { CodeGen } from "./Codegen";

(async () => {
  await CodeGen.run();
})().catch(console.log);
