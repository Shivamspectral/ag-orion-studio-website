"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { submitContactAction, type ContactState } from "@/lib/actions/contact";
import type { ContactChannel } from "@/content/types";
import { Button, Icon, Notice } from "./ui";
import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle", message: "" };

export function ContactForm({ channels, products, defaultTopic }: { channels: ContactChannel[]; products: { slug: string; name: string }[]; defaultTopic?: string }) {
  const [state, action, pending] = useActionState(submitContactAction, initialState);
  const [startedAt, setStartedAt] = useState("");
  const id = useId();

  useEffect(() => setStartedAt(String(Date.now())), []);

  if (state.status === "success") {
    return (
      <div className="surface-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <Icon name="check" className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Message sent</h3>
        <p className="mt-2 text-muted" role="status">
          {state.message}
        </p>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};
  const field = (name: keyof typeof errors) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    className: cn("field", errors[name] && "border-danger focus:ring-danger/30"),
  });
  const errorText = (name: keyof typeof errors) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="mt-1.5 text-xs text-danger">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form action={action} className="surface-card space-y-5 p-6 sm:p-8" noValidate>
      {state.status === "error" && <Notice tone="danger">{state.message}</Notice>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="field-label">
            Name
          </label>
          <input id={`${id}-name`} name="name" type="text" autoComplete="name" required maxLength={120} {...field("name")} />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="field-label">
            Email
          </label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={200} {...field("email")} />
          {errorText("email")}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-topic`} className="field-label">
            Topic
          </label>
          <select id={`${id}-topic`} name="topic" defaultValue={defaultTopic ?? "general"} {...field("topic")}>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.title}
              </option>
            ))}
          </select>
          {errorText("topic")}
        </div>
        <div>
          <label htmlFor={`${id}-product`} className="field-label">
            Related app or game <span className="font-normal text-muted-2">(optional)</span>
          </label>
          <select id={`${id}-product`} name="product" defaultValue="" className="field">
            <option value="">Not product specific</option>
            {products.map((product) => (
              <option key={product.slug} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="field-label">
          Message
        </label>
        <textarea id={`${id}-message`} name="message" rows={6} required minLength={20} maxLength={4000} {...field("message")} />
        {errorText("message")}
        <p className="field-hint">For support requests, include your device model, Android version and the app version if you know it.</p>
      </div>

      {/* Honeypot - hidden from people, attractive to bots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-2">By sending this form you agree to our privacy policy. We only use your details to reply.</p>
        <Button type="submit" disabled={pending} className="sm:w-auto">
          {pending ? "Sending…" : "Send message"}
          {!pending && <Icon name="arrow-right" className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
