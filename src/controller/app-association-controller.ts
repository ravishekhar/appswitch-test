import fs from "fs";
import path from "path";
import util from "util";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

const readFile = util.promisify(fs.readFile);

export async function androidAppLinkController(fastify: FastifyInstance) {
  fastify.get(
    "/.well-known/assetlinks.json",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      const data = await readFile(
        path.join(__dirname, "../../.well-known/assetlinks.json")
      );
      reply.header("Content-Type", "application/json");
      reply.send(data);
    }
  );
}

export async function iosAppLinkController(fastify: FastifyInstance) {
  [
    "/apple-app-site-association",
    "/.well-known/apple-app-site-association",
  ].forEach((urlPath) =>
    fastify.get(
      urlPath,
      async function (_request: FastifyRequest, reply: FastifyReply) {
        const data = await readFile(
          path.join(
            __dirname,
            "../../.well-known/apple-app-site-association.json"
          )
        );
        reply.header("Content-Type", "application/json");
        reply.send(data);
      }
    )
  );
}

export async function redirectBackToAppController(fastify: FastifyInstance) {
  fastify.route({
    url: "/paypal-checkout-complete",
    method: "GET",
    handler: async function (request: FastifyRequest, reply: FastifyReply) {
      // **Important** : Validate these URLs against an allowed list of URLs.
      // Never Trust any input from Web URLs
      const { redirectUrl, token } = request.query as {
        redirectUrl: string;
        token: string;
      };
      if (redirectUrl) {
        // MUST VALIDATE redirectUrl AGAINST AN ALLOWED LIST
        const url = new URL(redirectUrl);
        url.searchParams.append("payPalOrderID", token);
        reply.status(302).redirect(url.href);
      } else {
        reply.send(
          `Error: no redirectUrl URL is configured to redirect to Mobile App`
        );
      }
    },
    schema: {
      querystring: {
        redirectUrl: { type: "string" },
        // PayPal passes the OrderId as token in the redirect URL
        token: { type: "string" },
      },
    },
  });
}
