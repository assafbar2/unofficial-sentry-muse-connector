import { handleMe } from "@/lib/handlers";
import { jsonUnofficial } from "@/lib/http";
import { beginRequest, isResponse, sentryErrorResponse } from "@/lib/request";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = beginRequest(request);
  if (isResponse(ctx)) return ctx;

  try {
    const payload = await handleMe(ctx);
    return jsonUnofficial(payload);
  } catch (error) {
    return sentryErrorResponse(error);
  }
}
