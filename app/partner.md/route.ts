import { readFile } from "node:fs/promises";
import path from "node:path";
import { textUnofficial } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const body = await readFile(path.join(process.cwd(), "PARTNER.md"), "utf8");
  return textUnofficial(body, "text/markdown; charset=utf-8");
}
