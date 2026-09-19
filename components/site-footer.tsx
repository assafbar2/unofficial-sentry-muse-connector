import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_NAME,
  PRODUCT_NAME,
  UNOFFICIAL_DISCLAIMER,
} from "@/lib/disclaimer";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto max-w-3xl space-y-2 px-4 py-8 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{PRODUCT_NAME}</p>
        <p>{UNOFFICIAL_DISCLAIMER}</p>
        <p>
          Sentry, Muse, and Meta names are used only to describe this independent
          sketch. No directory listing, partnership, or endorsement is claimed.
        </p>
        <p>
          Questions:{" "}
          <a className="underline underline-offset-3 hover:text-foreground" href={CONTACT_MAILTO}>
            {CONTACT_NAME} ({CONTACT_EMAIL})
          </a>
          . Personal contact for this unofficial sketch, not a Sentry or Meta
          support channel.
        </p>
      </div>
    </footer>
  );
}
