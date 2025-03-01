import { fetch } from "undici";
import config from "../config";

const {
  paypal: { clientID, clientSecret, apiBaseUrl },
} = config;

type AuthTokenErrorResponse = {
  error: string;
  error_description: string;
};

interface HttpErrorResponse extends Error {
  statusCode?: number;
}

export default async function getSdkToken(
  client = clientID,
  secret = clientSecret
): Promise<string> {
  if (!client || !secret) {
    throw new Error("MISSING_API_CREDENTIALS");
  }

  const defaultErrorMessage = "FAILED_TO_CREATE_SDK_TOKEN";

  const encodedClientCredentials = Buffer.from(`${client}:${secret}`).toString(
    "base64"
  );
  let response;
  const formData = new URLSearchParams();
  formData.append("grant_type", "client_credentials");
  formData.append("response_type", "client_token");
  formData.append("intent", "sdk_init");

  try {
    response = await fetch(`${apiBaseUrl}/v1/oauth2/token`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Language": "en_US",
        Authorization: `Basic ${encodedClientCredentials}`,
      },
    });
    const data = await response.json();
    if (response.status !== 200) {
      const errorData = data as AuthTokenErrorResponse;
      const errorMessage = errorData.error
        ? `${errorData.error} - ${errorData.error_description}`
        : defaultErrorMessage;
      throw new Error(errorMessage);
    }

    // @ts-expect-error data is not typed properly
    const sdkClientToken: string = data.access_token;
    return sdkClientToken;
  } catch (error) {
    const httpError: HttpErrorResponse =
      error instanceof Error ? error : new Error(defaultErrorMessage);
    httpError.statusCode = response?.status;
    throw httpError;
  }
}
