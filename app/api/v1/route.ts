import { jsonError, jsonUnofficial } from "@/lib/http";
import {
  CONTACT_EMAIL,
  CONTACT_NAME,
  PRODUCT_NAME,
  UNOFFICIAL_DISCLAIMER,
  UNOFFICIAL_SHORT,
} from "@/lib/disclaimer";
import { requestOrigin } from "@/lib/muse";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const origin = requestOrigin(request);
  return jsonUnofficial({
    name: PRODUCT_NAME,
    summary: UNOFFICIAL_SHORT,
    disclaimer: UNOFFICIAL_DISCLAIMER,
    officialProduct: false,
    affiliatedWithSentry: false,
    affiliatedWithMeta: false,
    museDirectoryListing: false,
    note: "This discovery document describes an independent interpretation of how a Sentry connector for Muse could look. It is not a Meta-reviewed connector and not an official Sentry product.",
    links: {
      landing: origin,
      openapi: `${origin}/openapi.json`,
      skill: `${origin}/skill.md`,
      partnerPacket: `${origin}/partner.md`,
      me: `${origin}/api/v1/me`,
      issues: `${origin}/api/v1/issues`,
    },
    auth: {
      type: "Sentry User Auth Token as Authorization: Bearer",
      storesTokens: false,
    },
    contact: {
      name: CONTACT_NAME,
      email: CONTACT_EMAIL,
      note: "Personal contact for questions about this unofficial sketch. Not Sentry support and not Meta support.",
    },
  });
}

export function POST() {
  return jsonError(
    405,
    "method_not_allowed",
    "This unofficial concept discovery endpoint is GET-only.",
  );
}
