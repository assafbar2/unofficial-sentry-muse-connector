import { UNOFFICIAL_DISCLAIMER, unofficialHeaders, withUnofficial } from "@/lib/disclaimer";

export function jsonUnofficial(
  payload: object,
  init?: { status?: number; headers?: HeadersInit },
): Response {
  const headers = unofficialHeaders(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");

  return new Response(JSON.stringify(withUnofficial(payload)), {
    status: init?.status ?? 200,
    headers,
  });
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  extra?: object,
): Response {
  return jsonUnofficial(
    {
      error: { code, message, ...extra },
    },
    { status },
  );
}

export function textUnofficial(
  body: string,
  contentType: string,
  init?: { status?: number },
): Response {
  const headers = unofficialHeaders({
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Disclaimer": UNOFFICIAL_DISCLAIMER,
  });

  return new Response(body, {
    status: init?.status ?? 200,
    headers,
  });
}
