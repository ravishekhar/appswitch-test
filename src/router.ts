import type { FastifyInstance } from "fastify";
import {
  createOrderController,
  getOrderController,
  captureOrderController,
} from "./controller/order-controller";
import { configController } from "./controller/config-controller";
import { setErrorHandler } from "./controller/error-controller";
import {
  androidAppLinkController,
  iosAppLinkController,
  redirectBackToAppController,
} from "./controller/app-association-controller";
import {
  createVaultSetupTokenController,
  executeVaultSetupTokenController,
  getVaultSetupTokenController,
} from "./controller/vault-controller";
import { idTokenController } from "./controller/auth-controller";

export default async function router(fastify: FastifyInstance) {
  setErrorHandler(fastify);
  fastify.register(createOrderController, { prefix: "/api/paypal" });
  fastify.register(idTokenController, { prefix: "/api/paypal" });
  fastify.register(executeVaultSetupTokenController, { prefix: "/api/paypal" });
  fastify.register(captureOrderController, { prefix: "/api/paypal" });
  fastify.register(configController, { prefix: "/api/paypal" });
  fastify.register(getOrderController, { prefix: "/api/paypal" });
  fastify.register(createVaultSetupTokenController, { prefix: "/api/paypal" });
  fastify.register(getVaultSetupTokenController, { prefix: "/api/paypal" });
  fastify.register(androidAppLinkController);
  fastify.register(iosAppLinkController);
  fastify.register(redirectBackToAppController);
}
