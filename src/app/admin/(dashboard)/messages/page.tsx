import { Badge, Button, EmptyState } from "@/components/ui";
import { deleteMessageAction, listMessages, markMessageReadAction } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await listMessages();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
        <p className="mt-1 text-sm text-muted">Submissions from the public contact form. Reply from your own mailbox.</p>
      </div>
      {messages.length === 0 ? (
        <EmptyState icon="mail" title="No messages yet" description="Contact form submissions will show up here." />
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li key={message.id} className={`surface-card p-5 ${message.readAt ? "" : "border-accent/40"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground">{message.name}</p>
                <a href={`mailto:${message.email}`} className="text-sm text-accent-strong underline">{message.email}</a>
                <Badge tone="accent">{message.topic}</Badge>
                {message.product && <Badge>{message.product}</Badge>}
                {!message.readAt && <Badge tone="warning">Unread</Badge>}
                <span className="ml-auto text-xs text-muted-2">{formatDate(message.createdAt.toISOString(), { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">{message.message}</p>
              <div className="mt-4 flex gap-2">
                {!message.readAt && (
                  <form action={markMessageReadAction.bind(null, message.id)}>
                    <Button type="submit" variant="outline" size="sm">Mark as read</Button>
                  </form>
                )}
                <form action={deleteMessageAction.bind(null, message.id)}>
                  <Button type="submit" variant="ghost" size="sm">Delete</Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
