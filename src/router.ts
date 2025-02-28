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

export default async function router(fastify: FastifyInstance) {
  setErrorHandler(fastify);
  fastify.register(createOrderController, { prefix: "/api/paypal" });
  fastify.register(captureOrderController, { prefix: "/api/paypal" });
  fastify.register(configController, { prefix: "/api/paypal" });
  fastify.register(getOrderController, { prefix: "/api/paypal" });
  fastify.register(androidAppLinkController);
  fastify.register(iosAppLinkController);
  fastify.register(redirectBackToAppController);
}
