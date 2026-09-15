import { Button, Icon } from "@/components/ui";

export function NotFoundContent() {
  return (
    <div className="container-x py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-foreground sm:text-5xl">This page could not be found.</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        The link may be outdated, or the app or game you are looking for may have moved. Every product we publish is listed on the pages below.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/">
          Back to home
          <Icon name="arrow-right" className="h-4 w-4" />
        </Button>
        <Button href="/apps/" variant="secondary">
          Apps
        </Button>
        <Button href="/games/" variant="secondary">
          Games
        </Button>
      </div>
    </div>
  );
}
