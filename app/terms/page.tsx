import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_NAME,
  PRODUCT_NAME,
  UNOFFICIAL_DISCLAIMER,
} from "@/lib/disclaimer";

export const metadata: Metadata = {
  title: `Terms — ${PRODUCT_NAME}`,
  description: UNOFFICIAL_DISCLAIMER,
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 text-sm leading-7">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Unofficial concept
      </p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Terms of use
      </h1>
      <p>{UNOFFICIAL_DISCLAIMER}</p>
      <p>
        This website and API are an independent sketch. They are provided as-is,
        with no warranty, and are not a Sentry product, not a Meta product, and
        not a reviewed Muse directory connector.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>You use your own Sentry token and stay responsible for its scopes.</li>
        <li>
          Do not present this as official Sentry or official Muse. The
          unofficial labels are part of the product.
        </li>
        <li>
          Sentry, Muse, and Meta names are used only to describe the idea.
        </li>
        <li>
          You may stop using it by discarding the token in Sentry and
          disconnecting it in Muse.
        </li>
      </ul>
      <p>
        Questions:{" "}
        <a className="underline underline-offset-3" href={CONTACT_MAILTO}>
          {CONTACT_NAME} ({CONTACT_EMAIL})
        </a>
        .
      </p>
    </article>
  );
}
