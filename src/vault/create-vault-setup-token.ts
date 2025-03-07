import { fetch } from "undici";
import config from "../config";
import getAuthToken from "../auth/get-auth-token";
import { HttpErrorResponse } from "../order/order";

const {
  paypal: { apiBaseUrl },
} = config;

export type CreateVaultSetupTokenRequestBody = any;
type CreateVaultSetupTokenResponse = {
  data: {
    id: string;
  };
  paypalCorrelationId?: string | null;
  status: string;
  httpStatusCode: number;
};
type CreateVaultSetupTokenRequestHeaders = Partial<{
  "Content-Type": string;
  Authorization: string;
  "Accept-Language": string;
  Prefer: string;
  "PayPal-Request-Id": string;
}>;

type CreateVaultTokenOptions = {
  body: CreateVaultSetupTokenRequestBody;
  headers?: CreateVaultSetupTokenRequestHeaders;
};

export default async function createVaultSetupToken({
  body,
  headers = {},
}: CreateVaultTokenOptions): Promise<CreateVaultSetupTokenResponse> {
  if (!body) {
    throw new Error("MISSING_PAYLOAD_FOR_CREATE_VAULT_SETUP_TOKEN");
  }

  const { access_token: accessToken } = await getAuthToken();
  const defaultErrorMessage = "FAILED_TO_CREATE_VAULT_SETUP_TOKEN";

  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "Accept-Language": "en_US",
    Prefer: "return=minimal",
    ...headers,
  };

  let response;
  try {
    response = await fetch(`${apiBaseUrl}/v3/vault/setup-tokens`, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        status: "ok",
        paypalCorrelationId: response.headers.get("paypal-debug-id"),
        data,
        httpStatusCode: response.status,
      } as unknown as CreateVaultSetupTokenResponse;
    } else {
      return {
        status: "error",
        paypalCorrelationId: response.headers.get("paypal-debug-id"),
        data,
        httpStatusCode: response.status,
      } as unknown as CreateVaultSetupTokenResponse;
    }
  } catch (error) {
    const httpError: HttpErrorResponse =
      error instanceof Error ? error : new Error(defaultErrorMessage);
    httpError.statusCode = response?.status;
    throw httpError;
  }
}
