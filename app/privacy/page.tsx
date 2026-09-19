import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_NAME,
  PRODUCT_NAME,
  UNOFFICIAL_DISCLAIMER,
} from "@/lib/disclaimer";

export const metadata: Metadata = {
  title: `Privacy — ${PRODUCT_NAME}`,
  description: UNOFFICIAL_DISCLAIMER,
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 text-sm leading-7">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Unofficial concept
      </p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Privacy policy
      </h1>
      <p>{UNOFFICIAL_DISCLAIMER}</p>
      <p>
        This policy describes the independent sketch at this website. It is not
        Sentry’s privacy policy and not Meta’s privacy policy.
      </p>
      <h2 className="text-lg font-semibold">What this sketch does</h2>
      <p>
        When you connect it (for example from Muse as a custom connector), you
        supply a Sentry user auth token. This app forwards that Bearer token to
        Sentry’s public API to read (and, if you allow writes, lightly update)
        issue data you already can access in Sentry. It then returns a small
        summary to the caller.
      </p>
      <h2 className="text-lg font-semibold">What we do not keep</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>We do not store your Sentry token on our servers.</li>
        <li>We do not create a user account for this sketch.</li>
        <li>We do not sell data.</li>
        <li>
          Muse (Meta) may store credentials in Muse’s own vault if you connect
          there. That is Meta’s processing, not ours. See Meta’s policies.
        </li>
        <li>
          Sentry still processes whatever the token can access under Sentry’s
          privacy policy.
        </li>
      </ul>
      <h2 className="text-lg font-semibold">What may pass through</h2>
      <p>
        Request metadata (time, path, status) can appear in hosting logs.
        Issue titles, stacks, and similar fields from Sentry may appear in API
        responses sent back to you or to Muse acting for you. Do not use a
        token that can see data you do not want an assistant to read.
      </p>
      <h2 className="text-lg font-semibold">Contact</h2>
      <p>
        Questions:{" "}
        <a className="underline underline-offset-3" href={CONTACT_MAILTO}>
          {CONTACT_NAME} ({CONTACT_EMAIL})
        </a>
        . Personal contact for this unofficial sketch, not Sentry or Meta
        support.
      </p>
    </article>
  );
}
