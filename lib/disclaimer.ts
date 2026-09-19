export const UNOFFICIAL_SHORT =
  "Unofficial concept — not an official Sentry or Meta product.";

export const UNOFFICIAL_DISCLAIMER =
  "Unofficial concept. Not affiliated with, endorsed by, or published by Sentry or Meta. This is an independent interpretation of how a Sentry connector for Muse could look.";

export const UNOFFICIAL_HEADER = "X-Unofficial-Concept";

export const PRODUCT_NAME = "Unofficial concept: Sentry connector for Meta Muse";

export const CONTACT_NAME = "Assaf Barnir";
export const CONTACT_EMAIL = "assaf.barnir@sentry.io";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
export const CONTACT_BLURB = `Questions about this unofficial concept: ${CONTACT_NAME} <${CONTACT_EMAIL}>. This is a personal contact for the sketch, not a Sentry or Meta support channel.`;

export type UnofficialEnvelope = {
  unofficialConcept: true;
  disclaimer: typeof UNOFFICIAL_DISCLAIMER;
};

export function unofficialFields(): UnofficialEnvelope {
  return {
    unofficialConcept: true,
    disclaimer: UNOFFICIAL_DISCLAIMER,
  };
}

export function withUnofficial<T extends object>(
  payload: T,
): T & UnofficialEnvelope {
  return {
    ...unofficialFields(),
    ...payload,
  };
}

export function unofficialHeaders(
  extra?: HeadersInit,
): Headers {
  const headers = new Headers(extra);
  headers.set(UNOFFICIAL_HEADER, "true");
  headers.set("X-Product-Name", PRODUCT_NAME);
  return headers;
}
