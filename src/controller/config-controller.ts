import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import config from "../config";

const {
  paypal: {
    clientID,
    webBaseUrl,
    currency,
    intent,
    environment,
    enableOrderCapture,
  },
} = config;

export async function configController(fastify: FastifyInstance) {
  fastify.get(
    "/client-config",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      reply.send({
        clientID,
        webBaseUrl,
        currency,
        intent,
        environment,
        enableOrderCapture,
      });
    }
  );
}
