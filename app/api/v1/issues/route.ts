import {
  handleListIssues,
  MissingOrganizationError,
} from "@/lib/handlers";
import { jsonError, jsonUnofficial } from "@/lib/http";
import { beginRequest, isResponse, sentryErrorResponse } from "@/lib/request";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = beginRequest(request);
  if (isResponse(ctx)) return ctx;

  const url = new URL(request.url);
  const organization = url.searchParams.get("organization");
  const query = url.searchParams.get("query") ?? undefined;
  const statsPeriod = url.searchParams.get("statsPeriod") ?? undefined;
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined;

  if (limitRaw && !Number.isFinite(limit)) {
    return jsonError(
      400,
      "invalid_limit",
      "limit must be an integer. This unofficial concept caps results at 50.",
    );
  }

  try {
    const payload = await handleListIssues({
      ...ctx,
      organization,
      query,
      limit,
      statsPeriod,
    });
    return jsonUnofficial(payload);
  } catch (error) {
    if (error instanceof MissingOrganizationError) {
      return jsonError(400, "missing_organization", error.message);
    }
    return sentryErrorResponse(error);
  }
}
