export function DemoSketch() {
  return (
    <figure className="space-y-3">
      <figcaption className="text-sm text-muted-foreground">
        Sketch of a Muse chat after connect — demo copy, not a Meta screenshot.
      </figcaption>
      <div className="mx-auto w-full max-w-sm rounded-[2rem] border bg-background p-3 shadow-sm ring-1 ring-foreground/10">
        <div className="mb-3 flex items-center justify-between px-2 pt-1">
          <p className="text-xs font-medium text-muted-foreground">Muse · sketch</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Demo
          </p>
        </div>
        <div className="space-y-3 rounded-3xl bg-muted/60 p-3">
          <p className="ml-8 rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm text-primary-foreground">
            What’s on fire in Sentry?
          </p>
          <div className="mr-6 space-y-2 rounded-2xl rounded-bl-md bg-background px-3 py-2 text-sm ring-1 ring-foreground/10">
            <p>3 unresolved in <span className="font-medium">acme</span>.</p>
            <div className="rounded-xl bg-muted px-3 py-2">
              <p className="font-mono text-[11px] text-muted-foreground">
                CHECKOUT-12
              </p>
              <p className="font-medium">TypeError: Cannot read properties of undefined</p>
              <p className="text-xs text-muted-foreground">/checkout · 14 events · 2h</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Say the issue id if you want the latest stack, or ask me to resolve
              it after you confirm.
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}
