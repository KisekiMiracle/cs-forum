"use server";

import { db } from "@/app/db/drizzle";
import { news } from "@/app/db/schema";
import { desc } from "drizzle-orm";

export async function retrieveLatestNews() {
  try {
    const res = await db
      .select()
      .from(news)
      .orderBy(desc(news.createdAt))
      .limit(2);

    return {
      success: true,
      news: res,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.message ||
        "An unexpected error occurred while fetching the news.",
    };
  }
}
