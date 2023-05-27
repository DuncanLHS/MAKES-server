"use client";
import { signOut, useSession } from "next-auth/react";
import SignInWithDiscord from "./SignInWithDiscord";
import Button from "./ui/Button";

const SignIn = () => {
  const { data } = useSession();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {data ? (
        <Button type="button" onClick={() => void signOut()} intent="dark">
          Sign Out
        </Button>
      ) : (
        <SignInWithDiscord />
      )}
    </div>
  );
};

export default SignIn;
