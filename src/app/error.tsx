"use client";

import { useEffect } from "react";
import { Button, Icon } from "@/components/ui";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="flex flex-1 items-center">
      <div className="container-x py-24 text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">We hit an unexpected error.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">The problem has been logged. You can try again, or head back to the home page.</p>
        {error.digest && <p className="mt-2 text-xs text-muted-2">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>
            <Icon name="refresh" className="h-4 w-4" />
            Try again
          </Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </div>
    </main>
  );
}
