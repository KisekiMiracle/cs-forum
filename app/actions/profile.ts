"use server";

import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { user } from "../db/schema";
import { redirect } from "next/navigation";

export default async function getUserProfile({ id }: { id: string }) {
  const profile = (await db.select().from(user).where(eq(user.id, id)))[0];

  if (!profile) redirect("/404");

  return { profile: profile };
}

export async function getUserRole({ id }: { id: string }) {
  const role = (
    await db
      .select({
        role: user.role,
      })
      .from(user)
      .where(eq(user.id, id))
  )[0].role;

  return { role };
}
