// add a ".env" file to your project to set these environment variables
import { INTENT } from "@paypal/paypal-js";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const {
  PAYPAL_ENVIRONMENT_MODE,
  PAYPAL_SANDBOX_CLIENT_ID,
  PAYPAL_SANDBOX_CLIENT_SECRET,
  PAYPAL_LIVE_CLIENT_ID,
  PAYPAL_LIVE_CLIENT_SECRET,
  PAYPAL_CURRENCY,
  PAYPAL_INTENT,
  PAYPAL_API_BASE_URL,
  PAYPAL_WEB_BASE_URL,
  ENABLE_CAPTURE,
  SANDBOX_TOKENIZATION_KEY,
  PRODUCTION_TOKENIZATION_KEY,
  SANDBOX_PUBLIC_KEY,
  PRODUCTION_PUBLIC_KEY,
  SANDBOX_PRIVATE_KEY,
  PRODUCTION_PRIVATE_KEY,
} = process.env;

function getConfig() {
  const env = PAYPAL_ENVIRONMENT_MODE?.toLowerCase() || "sandbox";
  return {
    paypal: {
      environment: env,
      enableOrderCapture: ENABLE_CAPTURE === "true",
      clientID:
        env === "sandbox" ? PAYPAL_SANDBOX_CLIENT_ID : PAYPAL_LIVE_CLIENT_ID,
      clientSecret:
        env === "sandbox"
          ? PAYPAL_SANDBOX_CLIENT_SECRET
          : PAYPAL_LIVE_CLIENT_SECRET,
      intent: (PAYPAL_INTENT?.toUpperCase() as INTENT) || ("CAPTURE" as INTENT),
      currency: PAYPAL_CURRENCY || "USD",
      apiBaseUrl:
        PAYPAL_API_BASE_URL || env === "sandbox"
          ? "https://api-m.sandbox.paypal.com"
          : "https://api-m.paypal.com",
      webBaseUrl: PAYPAL_WEB_BASE_URL || "https://www.paypal.com",
      braintreeTokenizationKey: env === "sandbox" ? SANDBOX_TOKENIZATION_KEY : PRODUCTION_TOKENIZATION_KEY,
      braintreePublicKey: env === "sandbox" ? SANDBOX_PUBLIC_KEY : PRODUCTION_PUBLIC_KEY,
      braintreePrivateKey: env === "sandbox" ? SANDBOX_PRIVATE_KEY : PRODUCTION_PRIVATE_KEY,
    },
  };
}

export default getConfig();
