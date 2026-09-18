import { getBearerToken } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";
import {
  InvalidSentryHostError,
  SentryApiError,
  resolveSentryHost,
  type AllowedSentryHost,
} from "@/lib/sentry";

export type AuthedContext = {
  token: string;
  host: AllowedSentryHost;
  fetchImpl?: typeof fetch;
};

export function sentryErrorResponse(error: unknown): Response {
  if (error instanceof InvalidSentryHostError) {
    return jsonError(400, "invalid_sentry_host", error.message);
  }

  if (error instanceof SentryApiError) {
    const message =
      typeof error.body === "object" &&
      error.body !== null &&
      "detail" in error.body &&
      typeof error.body.detail === "string"
        ? error.body.detail
        : `Upstream Sentry API returned ${error.status}. This unofficial concept forwarded your Bearer token and did not store it.`;

    return jsonError(error.status, "sentry_api_error", message, {
      upstreamStatus: error.status,
    });
  }

  return jsonError(
    500,
    "internal_error",
    "This unofficial concept failed while talking to Sentry. Not an official Sentry or Meta product.",
  );
}

export function beginRequest(
  request: Request,
  options?: { requireAuth?: boolean },
): AuthedContext | Response {
  const limited = rateLimit(rateLimitKey(request));
  if (!limited.allowed) {
    return jsonError(
      429,
      "rate_limited",
      "Too many requests to this unofficial concept API. Retry after a minute.",
    );
  }

  const requireAuth = options?.requireAuth ?? true;
  if (!requireAuth) {
    try {
      return {
        token: "",
        host: resolveSentryHost(request.headers.get("x-sentry-host")),
      };
    } catch (error) {
      return sentryErrorResponse(error);
    }
  }

  const token = getBearerToken(request);
  if (!token) {
    return jsonError(
      401,
      "missing_bearer_token",
      "Send Authorization: Bearer <Sentry user auth token>. This unofficial concept does not mint tokens and is not an official Sentry or Meta product.",
    );
  }

  try {
    return {
      token,
      host: resolveSentryHost(request.headers.get("x-sentry-host")),
    };
  } catch (error) {
    return sentryErrorResponse(error);
  }
}

export function isResponse(value: AuthedContext | Response): value is Response {
  return value instanceof Response;
}
