import { headers } from "next/headers";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { CopyPrompt } from "@/components/copy-prompt";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_NAME,
  PRODUCT_NAME,
  UNOFFICIAL_DISCLAIMER,
} from "@/lib/disclaimer";
import { buildMuseConnectPrompt } from "@/lib/muse";

async function currentOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  if (!host) return "http://localhost:3000";
  return `${proto}://${host}`;
}

export default async function Home() {
  const origin = await currentOrigin();
  const prompt = buildMuseConnectPrompt(origin);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10">
      <section className="space-y-4">
        <Badge variant="outline">Unofficial concept</Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">
          {PRODUCT_NAME}
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">
          An independent sketch of how a Sentry on-call connector for Muse could
          look: a small REST API, an OpenAPI spec, and a SKILL Muse can read to
          list and lightly triage issues from a phone or WhatsApp.
        </p>
        <Alert>
          <TriangleAlert />
          <AlertTitle>Not an official product</AlertTitle>
          <AlertDescription>{UNOFFICIAL_DISCLAIMER}</AlertDescription>
        </Alert>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>What this unofficial interpretation covers</CardTitle>
          <CardDescription>
            Curated on-call actions only. Not Sentry MCP, not Seer, not a Meta
            directory listing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6">
          <p>
            Official Muse connectors are reviewed by Meta. This project is a
            <strong> custom-connector shaped concept</strong>: Muse reads the
            OpenAPI and SKILL, stores a Sentry user token in its own vault, and
            calls a narrow API. Nothing here is affiliated with or published by
            Sentry or Meta.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>See who the token belongs to and which orgs it can access</li>
            <li>Search unresolved issues with Sentry query syntax</li>
            <li>Open one issue and a truncated latest-event stack</li>
            <li>Optional writes: resolve, ignore, or assign — after the user confirms</li>
          </ul>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Connect this unofficial concept</h2>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-6">
          <li>
            In Sentry, create a{" "}
            <strong>User Auth Token</strong> with <code>event:read</code>,{" "}
            <code>org:read</code>, and <code>project:read</code>. Add{" "}
            <code>event:write</code> only if you want this unofficial triage
            PATCH.
          </li>
          <li>
            Copy the prompt below into Muse. Do not paste the token in the same
            message.
          </li>
          <li>
            When Muse asks for a credential, give the token as a Bearer secret.
            This unofficial API forwards it to Sentry and does not store it.
          </li>
        </ol>
        <Card>
          <CardContent className="pt-1">
            <CopyPrompt text={prompt} />
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Unofficial surfaces Muse can ingest
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <DocLink href="/openapi.json" title="OpenAPI" detail="Machine-readable unofficial API" />
          <DocLink href="/skill.md" title="SKILL.md" detail="How Muse should treat this concept" />
          <DocLink href="/api/v1" title="GET /api/v1" detail="Discovery JSON with disclaimer" />
          <DocLink href="/partner.md" title="Sample partner packet" detail="Not a real Meta submission" />
        </div>
        <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Unofficial concept API endpoints for a Sentry connector for Muse
            </caption>
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Method</th>
                <th className="px-3 py-2 font-medium">Path</th>
                <th className="px-3 py-2 font-medium">Class</th>
              </tr>
            </thead>
            <tbody>
              <Row method="GET" path="/api/v1/me" klass="read" />
              <Row method="GET" path="/api/v1/issues" klass="read" />
              <Row method="GET" path="/api/v1/issues/{id}" klass="read" />
              <Row method="GET" path="/api/v1/issues/{id}/latest-event" klass="read" />
              <Row method="PATCH" path="/api/v1/issues/{id}" klass="write" />
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Every JSON response includes <code>unofficialConcept: true</code> and
          the same disclaimer. Header <code>X-Unofficial-Concept: true</code> is
          also set. {UNOFFICIAL_DISCLAIMER}
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Questions about this unofficial concept</CardTitle>
          <CardDescription>
            Personal contact for the sketch — not Sentry support, not Meta
            support, not an official partner channel.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-6">
          <p>
            Ping{" "}
            <a className="font-medium underline underline-offset-3" href={CONTACT_MAILTO}>
              {CONTACT_NAME}
            </a>{" "}
            at{" "}
            <a className="font-medium underline underline-offset-3" href={CONTACT_MAILTO}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function DocLink({
  href,
  title,
  detail,
}: {
  href: string;
  title: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl p-3 ring-1 ring-foreground/10 transition-colors hover:bg-muted"
    >
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{detail}</p>
    </Link>
  );
}

function Row({
  method,
  path,
  klass,
}: {
  method: string;
  path: string;
  klass: "read" | "write";
}) {
  return (
    <tr className="border-t">
      <td className="px-3 py-2 font-mono text-xs">{method}</td>
      <td className="px-3 py-2 font-mono text-xs">{path}</td>
      <td className="px-3 py-2">
        <Badge variant={klass === "write" ? "destructive" : "secondary"}>
          {klass === "write" ? "mutating (unofficial)" : "read (unofficial)"}
        </Badge>
      </td>
    </tr>
  );
}
