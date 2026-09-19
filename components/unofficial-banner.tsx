import { TriangleAlert } from "lucide-react";
import { UNOFFICIAL_SHORT } from "@/lib/disclaimer";

export function UnofficialBanner() {
  return (
    <div
      role="status"
      className="border-b border-amber-700/40 bg-amber-100 text-amber-950 dark:border-amber-500/30 dark:bg-amber-950 dark:text-amber-50"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 text-sm leading-5">
        <TriangleAlert className="size-4 shrink-0" aria-hidden />
        <p className="font-semibold">{UNOFFICIAL_SHORT}</p>
      </div>
    </div>
  );
}
