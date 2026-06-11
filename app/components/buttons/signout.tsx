"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react"; // Optional: For a nice modern icon look
import { signOutAction } from "@/app/actions/auth";

export default function SignOutButton() {
  const [_, formAction, isPending] = useActionState(signOutAction, null);

  return (
    <form action={formAction} className="mt-2 w-full">
      <Button
        type="submit"
        variant="destructive"
        disabled={isPending}
        className="flex w-full items-center justify-start gap-1 px-2 text-sm  hover:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        {isPending ? "Logging out..." : "Log Out"}
      </Button>
    </form>
  );
}
