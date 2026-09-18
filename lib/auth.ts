export function getBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;

  const match = header.match(/^Bearer\s+(\S+)/i);
  if (!match?.[1]) return null;

  return match[1];
}
