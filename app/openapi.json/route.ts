import { unofficialHeaders } from "@/lib/disclaimer";
import { textUnofficial } from "@/lib/http";
import { buildOpenApi, requestOrigin } from "@/lib/muse";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const spec = buildOpenApi(requestOrigin(request));
  const headers = unofficialHeaders({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  return new Response(JSON.stringify(spec, null, 2), { headers });
}

export function HEAD() {
  return textUnofficial("", "application/json; charset=utf-8");
}
