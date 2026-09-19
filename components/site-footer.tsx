import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_NAME,
  PRODUCT_NAME,
} from "@/lib/disclaimer";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto max-w-3xl space-y-2 px-4 py-8 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{PRODUCT_NAME}</p>
        <p>
          Sentry, Muse, and Meta names describe this independent sketch only.
        </p>
        <p>
          Questions:{" "}
          <a className="underline underline-offset-3 hover:text-foreground" href={CONTACT_MAILTO}>
            {CONTACT_NAME} ({CONTACT_EMAIL})
          </a>
        </p>
        <p>
          <a className="underline underline-offset-3 hover:text-foreground" href="/privacy">
            Privacy
          </a>
          {" · "}
          <a className="underline underline-offset-3 hover:text-foreground" href="/terms">
            Terms
          </a>
          {" · "}
          <a className="underline underline-offset-3 hover:text-foreground" href="/how-it-looks.png">
            Screenshot
          </a>
        </p>
      </div>
    </footer>
  );
}
