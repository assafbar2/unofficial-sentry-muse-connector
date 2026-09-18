import { textUnofficial } from "@/lib/http";
import { buildSkillMarkdown, requestOrigin } from "@/lib/muse";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return textUnofficial(
    buildSkillMarkdown(requestOrigin(request)),
    "text/markdown; charset=utf-8",
  );
}
