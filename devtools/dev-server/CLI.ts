import { DevServer } from "@figliolia/typescript-dev-server";

(async () => {
  const Server = new DevServer({
    entryPoint: "src/Start.ts",
    serviceCommands: {
      Redis: "brew services start redis",
      Postgres: "brew services start postgresql@16",
    },
    killCommands: {
      Redis: "brew services stop redis",
      Postgres: "brew services stop postgresql@16",
    },
    nodeOptions: {
      NODE_ENV: "development",
      NODE_OPTIONS: "--enable-source-maps",
      NODE_EXTRA_CA_CERTS: "./cert/server.cert",
    },
  });
  await Server.run();
})().catch(console.log);
