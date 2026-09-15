import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/admin/forms";
import { Notice } from "@/components/ui";
import { isAdminConfigured } from "@/lib/auth";
import { getSiteConfig } from "@/lib/content";

export const metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  const config = await getSiteConfig();
  const configured = isAdminConfigured();
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src={config.brand.logoMark} alt="" width={56} height={56} unoptimized={config.brand.logoMark.endsWith(".svg")} className="rounded-2xl" />
          <h1 className="mt-4 text-2xl font-semibold text-foreground">{config.brand.name} admin</h1>
          <p className="mt-1 text-sm text-muted">Content, advertising and settings.</p>
        </div>
        <div className="surface-card p-6">
          {configured ? (
            <LoginForm />
          ) : (
            <Notice tone="warning" title="Admin disabled">
              Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> (16+ characters) in the server environment to enable the dashboard.
            </Notice>
          )}
        </div>
        <p className="mt-6 text-center text-sm text-muted-2">
          <Link href="/" className="hover:text-foreground">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
