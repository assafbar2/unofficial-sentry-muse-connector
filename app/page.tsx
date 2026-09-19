import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { CopyPrompt } from "@/components/copy-prompt";
import { DemoSketch } from "@/components/demo-sketch";
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
        <Image
          src="/connector-icon.png"
          alt="Cute Muse-style sketch icon in a purple cloak, not an official Sentry or Meta logo"
          width={77}
          height={77}
          className="rounded-2xl ring-1 ring-foreground/10"
        />
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">
          {PRODUCT_NAME}
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">
          A live on-call API you can use from Muse as a{" "}
          <strong className="text-foreground">custom connector</strong>, or call
          with curl. There is no signup on this site.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>What you can do on this page</CardTitle>
          <CardDescription>
            This host is running. You do not get an account here — you bring a
            Sentry token if you want data.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 text-sm leading-6 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="font-medium">You can</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Connect it in Muse today: copy the prompt, then paste your own
                Sentry User Auth Token when Muse asks. Ask “what’s on fire?”
              </li>
              <li>
                Hit the live API with that same token (
                <code>GET /api/v1/me</code>, list issues, optional resolve).
              </li>
              <li>
                Read OpenAPI, SKILL, privacy, and terms — Meta’s form uses these
                URLs too.
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium">You cannot</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Log in, create an account, or store a token on this site.</li>
              <li>
                Find this in Muse’s official directory unless Meta lists it
                later. Custom connector still works without that.
              </li>
              <li>Mint a Sentry token here, or use this as Sentry MCP.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How it could look</h2>
        <DemoSketch />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Use it from Muse</h2>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-6">
          <li>
            In Sentry, create a <strong>User Auth Token</strong> with{" "}
            <code>event:read</code>, <code>org:read</code>, and{" "}
            <code>project:read</code>. Add <code>event:write</code> only if you
            want resolve / ignore / assign.
          </li>
          <li>
            Copy the prompt below into Muse. Do not paste the token in the same
            message.
          </li>
          <li>
            When Muse asks for a credential, give the token as a Bearer secret.
            This API forwards it to Sentry and does not store it.
          </li>
        </ol>
        <Card>
          <CardContent className="pt-1">
            <CopyPrompt text={prompt} />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Or call the API yourself</h2>
        <p className="text-sm text-muted-foreground">
          Replace the token. Optional header{" "}
          <code>X-Sentry-Host: us.sentry.io</code> or <code>de.sentry.io</code>.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-5">
          {`curl -s ${origin}/api/v1/me \\
  -H "Authorization: Bearer $SENTRY_AUTH_TOKEN"`}
        </pre>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Spec and endpoints</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <DocLink href="/openapi.json" title="OpenAPI" detail="Machine-readable API" />
          <DocLink href="/skill.md" title="SKILL.md" detail="How Muse should treat this API" />
          <DocLink href="/api/v1" title="GET /api/v1" detail="Discovery JSON" />
          <DocLink href="/how-it-looks.png" title="Screenshot" detail="Demo sketch PNG for the Meta form" />
          <DocLink href="/privacy" title="Privacy" detail="Privacy URL for the Meta form" />
          <DocLink href="/terms" title="Terms" detail="Terms of use for this sketch" />
        </div>
        <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">API endpoints</caption>
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
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>
            Personal contact for the sketch — not Sentry support, not Meta
            support.
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
          {klass === "write" ? "write" : "read"}
        </Badge>
      </td>
    </tr>
  );
}
