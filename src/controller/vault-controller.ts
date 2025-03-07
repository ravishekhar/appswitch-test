import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import type { OrderResponseBody } from "@paypal/paypal-js";
import createVaultSetupToken, {
  CreateVaultSetupTokenRequestBody,
} from "../vault/create-vault-setup-token";
import getVaultSetupToken from "../vault/get-vault-setup-token";

async function createOrderHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { onCancelUrl, onApproveUrl, buyerEmail } = request.body as {
    buyerEmail: string;
    onCancelUrl: string;
    onApproveUrl: string;
  };

  const vaultSetupPayload: CreateVaultSetupTokenRequestBody = {
    customer: {
      email: buyerEmail,
    },
    payment_source: {
      paypal: {
        description: "Description for PayPal to be shown to PayPal payer",
        permit_multiple_payment_tokens: true,
        usage_pattern: "IMMEDIATE",
        usage_type: "MERCHANT",
        customer_type: "CONSUMER",
        experience_context: {
          shipping_preference: "NO_SHIPPING",
          payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
          brand_name: "EXAMPLE INC",
          locale: "en-US",
          return_url: onApproveUrl,
          cancel_url: onCancelUrl,
        },
      },
    },
  };

  const orderResponse = await createVaultSetupToken({
    body: vaultSetupPayload,
    headers: { Prefer: "return=representation" },
  });

  if (orderResponse.status === "ok") {
    const { id, status } = orderResponse.data as OrderResponseBody;
    request.log.info({ id, status }, "order successfully created");
  } else {
    request.log.error(orderResponse.data, "failed to create order");
  }

  reply
    .code(orderResponse.httpStatusCode as number)
    .header("debug-id", orderResponse.paypalCorrelationId)
    .send(orderResponse.data);
}

export async function createVaultSetupTokenController(
  fastify: FastifyInstance
) {
  fastify.route({
    method: "POST",
    url: "/create-vault-setup-token",
    handler: createOrderHandler,
    schema: {
      body: {
        type: "object",
        required: ["buyerEmail", "onApproveUrl", "onCancelUrl"],
        properties: {
          buyerEmail: {
            type: "string",
          },
          onApproveUrl: { type: "string" },
          onCancelUrl: { type: "string" },
        },
      },
    },
  });
}

//get order details
async function getVaultSetupTokenHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { vaultSetupToken } = request.query as { vaultSetupToken: string };
  const { data, paypalCorrelationId } = await getVaultSetupToken({
    vaultSetupToken,
  });
  // Send only required data to web. This is a bad practice to send complete order response
  reply.header("debug-id", paypalCorrelationId).send(data);
}

export async function getVaultSetupTokenController(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/get-vault-setup-token",
    handler: getVaultSetupTokenHandler,
    schema: {
      querystring: {
        vaultSetupToken: { type: "string" },
      },
    },
  });
}
