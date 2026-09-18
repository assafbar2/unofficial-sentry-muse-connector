import { TriangleAlert } from "lucide-react";
import { UNOFFICIAL_DISCLAIMER, UNOFFICIAL_SHORT } from "@/lib/disclaimer";

export function UnofficialBanner() {
  return (
    <div
      role="status"
      className="border-b border-amber-700/40 bg-amber-100 text-amber-950 dark:border-amber-500/30 dark:bg-amber-950 dark:text-amber-50"
    >
      <div className="mx-auto flex max-w-3xl gap-3 px-4 py-3 text-sm leading-5">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">{UNOFFICIAL_SHORT}</p>
          <p className="mt-1 text-amber-950/80 dark:text-amber-50/80">
            {UNOFFICIAL_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
