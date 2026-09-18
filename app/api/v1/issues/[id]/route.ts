import {
  handleGetIssue,
  handleUpdateIssue,
  InvalidIssueUpdateError,
} from "@/lib/handlers";
import { jsonError, jsonUnofficial } from "@/lib/http";
import { beginRequest, isResponse, sentryErrorResponse } from "@/lib/request";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const ctx = beginRequest(request);
  if (isResponse(ctx)) return ctx;

  const { id } = await context.params;

  try {
    const payload = await handleGetIssue({ ...ctx, issueId: id });
    return jsonUnofficial(payload);
  } catch (error) {
    return sentryErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const ctx = beginRequest(request);
  if (isResponse(ctx)) return ctx;

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(
      400,
      "invalid_json",
      "PATCH body must be JSON. This unofficial concept only accepts status and/or assignedTo.",
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return jsonError(
      400,
      "invalid_json",
      "PATCH body must be an object. Unofficial concept — not an official Sentry API.",
    );
  }

  const record = body as Record<string, unknown>;
  const extraKeys = Object.keys(record).filter(
    (key) => key !== "status" && key !== "assignedTo",
  );
  if (extraKeys.length > 0) {
    return jsonError(
      400,
      "unexpected_fields",
      `This unofficial concept rejects unknown PATCH fields: ${extraKeys.join(", ")}`,
    );
  }

  try {
    const payload = await handleUpdateIssue({
      ...ctx,
      issueId: id,
      status: record.status,
      assignedTo: record.assignedTo,
    });
    return jsonUnofficial(payload);
  } catch (error) {
    if (error instanceof InvalidIssueUpdateError) {
      return jsonError(400, "invalid_issue_update", error.message);
    }
    return sentryErrorResponse(error);
  }
}
