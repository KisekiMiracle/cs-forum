"use client";

import { useEffect, useState } from "react";
import { UserRound, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignOutButton from "../buttons/signout"; // Verify your path matches
import Link from "next/link";

// Pass the raw user session object down as a type-safe prop
interface UserMenuProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    id: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [mounted, setMounted] = useState(false);

  // Force mounting state to trigger only after the client handles the DOM tree
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a matching static shell/skeleton layout during server compilation
    return (
      <div className="flex animate-pulse items-center gap-1 p-4 text-transparent select-none">
        <div className="h-8 w-8 rounded-full bg-muted" />
        <span>{user.name}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-sm p-4 transition-all duration-150 hover:cursor-pointer hover:bg-amber-50/10 hover:text-amber-300"
        >
          <Avatar>
            <AvatarImage
              src={user.image || undefined}
              alt={user.name}
              className="grayscale"
            />
            <AvatarFallback>
              {user.name.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-xs p-4" align="end">
        <DropdownMenuGroup>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={user.image || undefined}
                alt={user.name}
                className="grayscale"
              />
              <AvatarFallback>
                {user.name.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate text-xs">
              <span className="truncate font-bold">{user.name}</span>
              <span className="truncate text-neutral-500">{user.email}</span>
            </div>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="mt-3" />
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem asChild className="cursor-pointer gap-2">
            <Link
              href={`/profile/${user.id}`}
              className="flex w-full items-center gap-1"
            >
              <UserRound size={14} />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer gap-2">
            <Link
              href={`/profile/${user.id}/security`}
              className="flex w-full items-center gap-1"
            >
              <Lock size={14} />
              Security
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
