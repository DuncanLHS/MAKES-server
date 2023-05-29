"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@ui/DropdownMenu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import UserProfileIcon from "./images/UserProfileIcon";

export function ProfileMenu() {
  const { data } = useSession();
  if (!data) return null;

  const {
    user: { name, nick },
  } = data;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserProfileIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{nick ?? name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void signOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileMenu;
