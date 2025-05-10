import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import getSdkToken from "../auth/get-id-token";

export async function idTokenController(fastify: FastifyInstance) {
  fastify.get(
    "/generate-id-token",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      const idToken = await getSdkToken();
      reply.send({ idToken });
    }
  );
}
