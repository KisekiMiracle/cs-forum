import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function SignUpButton() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return (
      <Link href="/signup">
        <Button className="flex items-center gap-1 bg-transparent hover:bg-white hover:text-neutral-900 border border-white hover:border-transparent">
          <ArrowUpRight size={16} />
          <span>Sign Up</span>
        </Button>
      </Link>
    );

  return <></>;
}
