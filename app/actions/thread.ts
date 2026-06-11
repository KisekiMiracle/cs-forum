"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { thread, user } from "../db/schema";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { getUserRole } from "./profile";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getNewestThreads() {
  try {
    const entries = await db
      .select()
      .from(thread)
      .orderBy(desc(thread.createdAt))
      .limit(5)
      .leftJoin(user, eq(thread.authorId, user.id));

    return {
      success: true,
      threads: entries,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.message ||
        "An unexpected error occurred while fetching newest threads.",
    };
  }
}

export async function getRecentActivityThreads() {
  try {
    const entries = await db
      .select()
      .from(thread)
      .orderBy(desc(thread.updatedAt))
      .limit(5)
      .leftJoin(user, eq(thread.authorId, user.id));

    return {
      success: true,
      threads: entries,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.message ||
        "An unexpected error occurred while fetching threads with the latest activity.",
    };
  }
}

export async function getIndividualThread({ id }: { id: string }) {
  try {
    const entry = (await db.select().from(thread).where(eq(thread.id, id)))[0];

    return {
      success: true,
      entry,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.message ||
        "An unexpected error occurred while fetching this thread.",
    };
  }
}

export async function saveIndividualThread(payload: {
  id: string;
  title: string;
  tags: string[];
  content: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  const targetRows = await db
    .select()
    .from(thread)
    .where(eq(thread.id, payload.id))
    .limit(1);

  const targetThread = targetRows[0];

  if (!targetThread) {
    throw new Error("Thread not found.");
  }

  const { role } = await getUserRole({ id: session.user.id });

  // ❌ 4. Reject if they aren't the creator AND aren't an admin
  if (targetThread.authorId !== session.user.id && role !== "ADMIN") {
    throw new Error("Unauthorized: You do not own this post.");
  }

  try {
    await db
      .update(thread)
      .set({
        title: payload.title,
        tags: payload.tags,
        content: payload.content,
      })
      .where(eq(thread.id, payload.id));
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }

  revalidatePath(`/thread/${payload.id}/edit`);
  redirect(`/thread/${payload.id}`);
}
