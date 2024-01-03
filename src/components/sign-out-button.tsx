"use client";

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { Button, ButtonProps } from "./ui/button";

export default function SignOutButton({}: ButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      toast.error("Uh oh! Something went wrong.", {
        description: "There was a problem signing you out.",
      });
    }

    setIsSigningOut(false);
  }

  return (
    <Button variant="ghost" disabled={isSigningOut} onClick={handleSignOut}>
      {isSigningOut ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </Button>
  );
}
