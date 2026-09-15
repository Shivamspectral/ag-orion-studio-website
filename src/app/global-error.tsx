"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0d15", color: "#f3f5f9", fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", textAlign: "center", padding: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>Something went wrong</h1>
          <p style={{ color: "#a3abbb", marginBottom: "1.5rem" }}>Please try again in a moment.</p>
          <button type="button" onClick={reset} style={{ background: "#3b82f6", color: "#fff", border: 0, borderRadius: 12, padding: "0.75rem 1.25rem", fontWeight: 600, cursor: "pointer" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
