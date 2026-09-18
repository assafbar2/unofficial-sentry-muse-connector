export const ALLOWED_SENTRY_HOSTS = [
  "sentry.io",
  "us.sentry.io",
  "de.sentry.io",
] as const;

export type AllowedSentryHost = (typeof ALLOWED_SENTRY_HOSTS)[number];

export class InvalidSentryHostError extends Error {
  constructor(host: string) {
    super(
      `Unofficial concept: X-Sentry-Host must be one of ${ALLOWED_SENTRY_HOSTS.join(", ")} (got "${host}"). This is an independent interpretation of a Sentry connector for Muse, not an official Sentry or Meta product.`,
    );
    this.name = "InvalidSentryHostError";
  }
}

export class SentryApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`Sentry API error ${status}`);
    this.name = "SentryApiError";
  }
}

export function resolveSentryHost(header: string | null | undefined): AllowedSentryHost {
  const raw = (header ?? "sentry.io")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

  if ((ALLOWED_SENTRY_HOSTS as readonly string[]).includes(raw)) {
    return raw as AllowedSentryHost;
  }

  throw new InvalidSentryHostError(raw || "(empty)");
}

export type SentryFetchOptions = {
  token: string;
  host: AllowedSentryHost;
  path: string;
  method?: string;
  body?: unknown;
  searchParams?: URLSearchParams;
  fetchImpl?: typeof fetch;
};

export async function sentryFetch<T>(options: SentryFetchOptions): Promise<T> {
  const {
    token,
    host,
    path,
    method = "GET",
    body,
    searchParams,
    fetchImpl = fetch,
  } = options;

  const url = new URL(path, `https://${host}`);
  if (searchParams) {
    url.search = searchParams.toString();
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetchImpl(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    let parsed: unknown = await response.text();
    try {
      parsed = JSON.parse(parsed as string);
    } catch {
      // keep text
    }
    throw new SentryApiError(response.status, parsed);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export type SentryUser = {
  id: string;
  name?: string;
  email?: string;
  username?: string;
};

export type SentryOrganization = {
  id: string;
  slug: string;
  name: string;
  status?: { id?: string };
  links?: { regionUrl?: string };
};

export type SentryAssignee = {
  type?: string;
  id?: string;
  name?: string;
  email?: string;
};

export type SentryIssue = {
  id: string;
  shortId?: string;
  title?: string;
  culprit?: string;
  permalink?: string;
  status?: string;
  substatus?: string;
  level?: string;
  count?: string | number;
  userCount?: number;
  firstSeen?: string;
  lastSeen?: string;
  priority?: string;
  assignedTo?: SentryAssignee | null;
  project?: { id?: string; slug?: string; name?: string; platform?: string };
  metadata?: { title?: string };
};

export type SentryFrame = {
  filename?: string;
  absPath?: string;
  function?: string;
  lineNo?: number;
  colNo?: number;
  inApp?: boolean;
};

export type SentryEvent = {
  id?: string;
  eventID?: string;
  title?: string;
  message?: string;
  culprit?: string;
  dateCreated?: string;
  platform?: string;
  tags?: Array<{ key?: string; value?: string }>;
  entries?: Array<{
    type?: string;
    data?: {
      values?: Array<{
        type?: string;
        value?: string;
        stacktrace?: { frames?: SentryFrame[] };
      }>;
      formatted?: string;
    };
  }>;
};

export type IssueSummary = {
  id: string;
  shortId: string | null;
  title: string;
  culprit: string | null;
  status: string | null;
  substatus: string | null;
  level: string | null;
  count: string | number | null;
  userCount: number | null;
  firstSeen: string | null;
  lastSeen: string | null;
  permalink: string | null;
  priority: string | null;
  project: { slug: string | null; name: string | null } | null;
  assignedTo: { name: string | null; type: string | null } | null;
};

export function summarizeIssue(issue: SentryIssue): IssueSummary {
  return {
    id: issue.id,
    shortId: issue.shortId ?? null,
    title: issue.title ?? issue.metadata?.title ?? "Untitled issue",
    culprit: issue.culprit ?? null,
    status: issue.status ?? null,
    substatus: issue.substatus ?? null,
    level: issue.level ?? null,
    count: issue.count ?? null,
    userCount: issue.userCount ?? null,
    firstSeen: issue.firstSeen ?? null,
    lastSeen: issue.lastSeen ?? null,
    permalink: issue.permalink ?? null,
    priority: issue.priority ?? null,
    project: issue.project
      ? { slug: issue.project.slug ?? null, name: issue.project.name ?? null }
      : null,
    assignedTo: issue.assignedTo
      ? {
          name: issue.assignedTo.name ?? null,
          type: issue.assignedTo.type ?? null,
        }
      : null,
  };
}

export type EventSummary = {
  eventId: string | null;
  message: string | null;
  exceptionType: string | null;
  culprit: string | null;
  timestamp: string | null;
  platform: string | null;
  stack: Array<{
    filename: string | null;
    function: string | null;
    lineNo: number | null;
    inApp: boolean | null;
  }>;
  tags: Array<{ key: string; value: string | null }>;
};

const MAX_FRAMES = 10;
const MAX_TAGS = 15;

export function summarizeEvent(event: SentryEvent): EventSummary {
  const exceptionEntry = event.entries?.find((entry) => entry.type === "exception");
  const firstValue = exceptionEntry?.data?.values?.[0];
  const messageEntry = event.entries?.find((entry) => entry.type === "message");
  const frames = firstValue?.stacktrace?.frames ?? [];
  const truncatedFrames = frames.slice(-MAX_FRAMES);

  return {
    eventId: event.eventID ?? event.id ?? null,
    message:
      firstValue?.value ??
      event.message ??
      messageEntry?.data?.formatted ??
      event.title ??
      null,
    exceptionType: firstValue?.type ?? null,
    culprit: event.culprit ?? null,
    timestamp: event.dateCreated ?? null,
    platform: event.platform ?? null,
    stack: truncatedFrames.map((frame) => ({
      filename: frame.filename ?? frame.absPath ?? null,
      function: frame.function ?? null,
      lineNo: frame.lineNo ?? null,
      inApp: frame.inApp ?? null,
    })),
    tags: (event.tags ?? []).slice(0, MAX_TAGS).map((tag) => ({
      key: tag.key ?? "",
      value: tag.value ?? null,
    })),
  };
}

export async function getSentryUser(options: {
  token: string;
  host: AllowedSentryHost;
  fetchImpl?: typeof fetch;
}): Promise<SentryUser> {
  return sentryFetch<SentryUser>({
    ...options,
    path: "/api/0/users/me/",
  });
}

export async function listSentryOrganizations(options: {
  token: string;
  host: AllowedSentryHost;
  fetchImpl?: typeof fetch;
}): Promise<SentryOrganization[]> {
  return sentryFetch<SentryOrganization[]>({
    ...options,
    path: "/api/0/organizations/",
  });
}

export async function listSentryIssues(options: {
  token: string;
  host: AllowedSentryHost;
  organization: string;
  query?: string;
  limit?: number;
  statsPeriod?: string;
  fetchImpl?: typeof fetch;
}): Promise<SentryIssue[]> {
  const searchParams = new URLSearchParams();
  if (options.query !== undefined) {
    searchParams.set("query", options.query);
  }
  searchParams.set("limit", String(options.limit ?? 10));
  if (options.statsPeriod) {
    searchParams.set("statsPeriod", options.statsPeriod);
  }
  searchParams.append("collapse", "stats");
  searchParams.append("collapse", "lifetime");

  return sentryFetch<SentryIssue[]>({
    token: options.token,
    host: options.host,
    path: `/api/0/organizations/${encodeURIComponent(options.organization)}/issues/`,
    searchParams,
    fetchImpl: options.fetchImpl,
  });
}

export async function getSentryIssue(options: {
  token: string;
  host: AllowedSentryHost;
  issueId: string;
  fetchImpl?: typeof fetch;
}): Promise<SentryIssue> {
  return sentryFetch<SentryIssue>({
    token: options.token,
    host: options.host,
    path: `/api/0/issues/${encodeURIComponent(options.issueId)}/`,
    fetchImpl: options.fetchImpl,
  });
}

export async function updateSentryIssue(options: {
  token: string;
  host: AllowedSentryHost;
  issueId: string;
  status?: string;
  assignedTo?: string | null;
  fetchImpl?: typeof fetch;
}): Promise<SentryIssue> {
  const body: { status?: string; assignedTo?: string | null } = {};
  if (options.status !== undefined) body.status = options.status;
  if (options.assignedTo !== undefined) body.assignedTo = options.assignedTo;

  return sentryFetch<SentryIssue>({
    token: options.token,
    host: options.host,
    path: `/api/0/issues/${encodeURIComponent(options.issueId)}/`,
    method: "PUT",
    body,
    fetchImpl: options.fetchImpl,
  });
}

export async function getSentryLatestEvent(options: {
  token: string;
  host: AllowedSentryHost;
  issueId: string;
  fetchImpl?: typeof fetch;
}): Promise<SentryEvent> {
  return sentryFetch<SentryEvent>({
    token: options.token,
    host: options.host,
    path: `/api/0/issues/${encodeURIComponent(options.issueId)}/events/latest/`,
    fetchImpl: options.fetchImpl,
  });
}
