import {
  getSentryIssue,
  getSentryLatestEvent,
  getSentryUser,
  listSentryIssues,
  listSentryOrganizations,
  summarizeEvent,
  summarizeIssue,
  updateSentryIssue,
  type AllowedSentryHost,
} from "@/lib/sentry";

export const ALLOWED_ISSUE_STATUSES = [
  "resolved",
  "unresolved",
  "ignored",
] as const;

export type AllowedIssueStatus = (typeof ALLOWED_ISSUE_STATUSES)[number];

function regionHostFromOrg(org: { links?: { regionUrl?: string } }): string | null {
  const regionUrl = org.links?.regionUrl;
  if (!regionUrl) return null;
  try {
    return new URL(regionUrl).host;
  } catch {
    return null;
  }
}

export async function handleMe(options: {
  token: string;
  host: AllowedSentryHost;
  fetchImpl?: typeof fetch;
}) {
  const [user, organizations] = await Promise.all([
    getSentryUser(options),
    listSentryOrganizations(options),
  ]);

  return {
    note: "Unofficial concept. Identity is read from Sentry with the caller-supplied token and is not stored here.",
    user: {
      id: user.id,
      name: user.name ?? null,
      email: user.email ?? null,
      username: user.username ?? null,
    },
    host: options.host,
    organizations: organizations.map((org) => ({
      id: org.id,
      slug: org.slug,
      name: org.name,
      suggestedSentryHost: regionHostFromOrg(org),
    })),
  };
}

export async function handleListIssues(options: {
  token: string;
  host: AllowedSentryHost;
  organization: string | null;
  query: string | undefined;
  limit: number | undefined;
  statsPeriod: string | undefined;
  fetchImpl?: typeof fetch;
}) {
  if (!options.organization) {
    throw new MissingOrganizationError();
  }

  const limit = Math.min(Math.max(options.limit ?? 10, 1), 50);
  const issues = await listSentryIssues({
    token: options.token,
    host: options.host,
    organization: options.organization,
    query: options.query,
    limit,
    statsPeriod: options.statsPeriod,
    fetchImpl: options.fetchImpl,
  });

  return {
    note: "Unofficial concept. This is a curated on-call slice of Sentry issues, not the full Sentry API and not an official Muse directory connector.",
    organization: options.organization,
    query: options.query ?? "(Sentry default: is:unresolved)",
    issues: issues.map(summarizeIssue),
  };
}

export async function handleGetIssue(options: {
  token: string;
  host: AllowedSentryHost;
  issueId: string;
  fetchImpl?: typeof fetch;
}) {
  const issue = await getSentryIssue(options);
  return {
    note: "Unofficial concept. Issue payload is summarized for Muse; it is not an official Sentry product response.",
    issue: summarizeIssue(issue),
  };
}

export async function handleLatestEvent(options: {
  token: string;
  host: AllowedSentryHost;
  issueId: string;
  fetchImpl?: typeof fetch;
}) {
  const event = await getSentryLatestEvent(options);
  return {
    note: "Unofficial concept. Event data is truncated (no breadcrumbs, request bodies, or user PII blobs) so Muse can sketch a stack, not reconstruct the full issue.",
    issueId: options.issueId,
    event: summarizeEvent(event),
  };
}

export class MissingOrganizationError extends Error {
  constructor() {
    super(
      "Pass ?organization=<org-slug> from GET /api/v1/me. This unofficial concept will not guess an org.",
    );
    this.name = "MissingOrganizationError";
  }
}

export class InvalidIssueUpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidIssueUpdateError";
  }
}

export async function handleUpdateIssue(options: {
  token: string;
  host: AllowedSentryHost;
  issueId: string;
  status?: unknown;
  assignedTo?: unknown;
  fetchImpl?: typeof fetch;
}) {
  const hasStatus = options.status !== undefined;
  const hasAssignee = options.assignedTo !== undefined;

  if (!hasStatus && !hasAssignee) {
    throw new InvalidIssueUpdateError(
      "PATCH must include status and/or assignedTo. This unofficial concept only exposes light triage, not project admin.",
    );
  }

  let status: AllowedIssueStatus | undefined;
  if (hasStatus) {
    if (
      typeof options.status !== "string" ||
      !(ALLOWED_ISSUE_STATUSES as readonly string[]).includes(options.status)
    ) {
      throw new InvalidIssueUpdateError(
        `status must be one of ${ALLOWED_ISSUE_STATUSES.join(", ")}.`,
      );
    }
    status = options.status as AllowedIssueStatus;
  }

  let assignedTo: string | null | undefined;
  if (hasAssignee) {
    if (options.assignedTo !== null && typeof options.assignedTo !== "string") {
      throw new InvalidIssueUpdateError(
        "assignedTo must be a Sentry username, \"me\", or null to unassign.",
      );
    }
    assignedTo = options.assignedTo;
  }

  const issue = await updateSentryIssue({
    token: options.token,
    host: options.host,
    issueId: options.issueId,
    status,
    assignedTo,
    fetchImpl: options.fetchImpl,
  });

  return {
    note: "Unofficial concept. Mutating call forwarded to Sentry PUT /api/0/issues/{id}/. Not an official Sentry or Meta connector.",
    mutating: true,
    issue: summarizeIssue(issue),
  };
}
