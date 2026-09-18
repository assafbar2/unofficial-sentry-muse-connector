"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UNOFFICIAL_SHORT } from "@/lib/disclaimer";

export function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">
          Unofficial Muse custom-connector prompt
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCopy}
          aria-label="Copy unofficial Muse connector prompt"
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{UNOFFICIAL_SHORT}</p>
      <pre
        className="overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-5 whitespace-pre-wrap"
        data-testid="muse-connect-prompt"
      >
        {text}
      </pre>
    </div>
  );
}
