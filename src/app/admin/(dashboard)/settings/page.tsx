import { SettingsForm } from "@/components/admin/forms";
import { Button, Notice } from "@/components/ui";
import { resetSiteSettingsAction } from "@/lib/actions/admin";
import { getSiteConfig, getSiteSettingsOverrides } from "@/lib/content";

export const metadata = { title: "Studio settings" };

export default async function AdminSettingsPage() {
  const [config, overrides] = await Promise.all([getSiteConfig(), getSiteSettingsOverrides()]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Studio settings</h1>
          <p className="mt-1 text-sm text-muted">Brand, SEO defaults, homepage copy, about text, contact channels and website ads.</p>
        </div>
        {overrides && (
          <form action={resetSiteSettingsAction}>
            <Button type="submit" variant="danger" size="sm">
              Reset to file defaults
            </Button>
          </form>
        )}
      </div>
      <Notice tone="info">
        Values saved here are stored in the database and override <code>src/config/site.ts</code>. The site URL, analytics ID and admin credentials are environment variables and cannot be edited from the browser.
      </Notice>
      <SettingsForm settings={config} />
    </div>
  );
}
