import Link from "next/link";
import SignInButton from "../buttons/signin";
import SignUpButton from "../buttons/signup";

export default function TopNavBar() {
  return (
    <nav className="flex w-dvw items-center justify-center bg-neutral-900 p-6 text-white">
      <div className="flex w-full items-center justify-between md:max-w-7xl">
        <Link href={"/"} className="text-2xl font-bold">
          Sweetroll Forums
        </Link>
        <ul>
          <li></li>
        </ul>

        <div className="flex items-center gap-2">
          <SignInButton />
          <SignUpButton />
        </div>
      </div>
    </nav>
  );
}
