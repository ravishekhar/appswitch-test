import buildApp from "./app";

const FASTIFY_PORT =
  Number(process.env.PORT) || Number(process.env.FASTIFY_PORT) || 3006;
const FASTIFY_HOST = process.env.HOST || process.env.FASTIFY_HOST || "0.0.0.0";

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const environment =
  (process.env.NODE_ENV as keyof typeof envToLogger) ?? "development";

const app = buildApp({
  logger: envToLogger[environment] ?? true,
});

app
  .listen({
    port: FASTIFY_PORT,
    host: FASTIFY_HOST,
  })
  .then((host) => console.log(`🚀  Fastify server started`, host))
  .catch((err) => console.error("Error in starting server", err));
