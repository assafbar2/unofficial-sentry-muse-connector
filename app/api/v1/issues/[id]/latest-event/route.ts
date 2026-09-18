import { handleLatestEvent } from "@/lib/handlers";
import { jsonUnofficial } from "@/lib/http";
import { beginRequest, isResponse, sentryErrorResponse } from "@/lib/request";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const ctx = beginRequest(request);
  if (isResponse(ctx)) return ctx;

  const { id } = await context.params;

  try {
    const payload = await handleLatestEvent({ ...ctx, issueId: id });
    return jsonUnofficial(payload);
  } catch (error) {
    return sentryErrorResponse(error);
  }
}
