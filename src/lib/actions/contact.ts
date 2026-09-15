"use server";

import { and, count, eq, gt } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { clientIpHash } from "@/lib/auth";
import { contactSchema } from "@/lib/validation";

export interface ContactState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "topic" | "message", string>>;
}

const MIN_FILL_TIME_MS = 3000;
const MAX_MESSAGES_PER_WINDOW = 5;
const WINDOW_MINUTES = 10;

export async function submitContactAction(_prev: ContactState, data: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: data.get("name"),
    email: data.get("email"),
    topic: data.get("topic"),
    product: data.get("product") || undefined,
    message: data.get("message"),
    website: data.get("website") || undefined,
    startedAt: data.get("startedAt") || undefined,
  });

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error);
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const key of ["name", "email", "topic", "message"] as const) {
      const first = flattened.fieldErrors[key]?.[0];
      if (first) fieldErrors[key] = first;
    }
    if (flattened.fieldErrors.website) {
      // Honeypot filled in: pretend success so bots learn nothing.
      return { status: "success", message: "Thanks - your message has been received." };
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  const { name, email, topic, product, message, startedAt } = parsed.data;
  if (startedAt && Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return { status: "success", message: "Thanks - your message has been received." };
  }

  try {
    const ipHash = await clientIpHash();
    const since = new Date(Date.now() - WINDOW_MINUTES * 60_000);
    const [recent] = await db
      .select({ value: count() })
      .from(contactMessages)
      .where(and(eq(contactMessages.ipHash, ipHash), gt(contactMessages.createdAt, since)));
    if ((recent?.value ?? 0) >= MAX_MESSAGES_PER_WINDOW) {
      return { status: "error", message: "You have sent several messages recently. Please wait a few minutes and try again." };
    }

    const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
    await db.insert(contactMessages).values({ name, email, topic, product: product ?? null, message, ipHash, userAgent });
    return { status: "success", message: "Thanks - your message has been received. We will get back to you by email." };
  } catch (error) {
    console.error("[contact] failed to store message", error);
    return { status: "error", message: "We could not send your message right now. Please try again in a moment." };
  }
}
