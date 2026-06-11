import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import UserMenu from "../navigation/user-menu";

export default async function SignInButton() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <Link href="/signin">
        <Button className="flex items-center gap-1" variant="secondary">
          <LogIn size={16} />
          <span>Sign In</span>
        </Button>
      </Link>
    );
  }

  // Pass session data into the safely isolated client component container
  return <UserMenu user={session.user} />;
}
