"use client";

import { saveIndividualThread } from "@/app/actions/thread";
import { Button } from "@/components/ui/button";
import { useThreadEditStore } from "@/lib/store";
import { useState } from "react";

export function SaveThreadButton({ threadId }: { threadId: string }) {
  const [isSaving, setIsSaving] = useState(false);

  // 🟢 Extract the live fields directly from your Zustand store!
  const title = useThreadEditStore((s) => s.title);
  const tags = useThreadEditStore((s) => s.tags);
  const markdownContent = useThreadEditStore((s) => s.markdownContent);

  const handleSave = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);

    // Process tags comma parsing
    const processedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const payload = {
      id: threadId,
      title: title,
      tags: processedTags,
      content: markdownContent,
    };

    console.log("🔥 Zustand Triggered Submission Payload:", payload);

    await saveIndividualThread(payload);
    setIsSaving(false);
  };

  return (
    <Button type="submit" onClick={handleSave} disabled={isSaving}>
      {isSaving ? "Saving..." : "Save Changes"}
    </Button>
  );
}
