"use client";
import { signOut, signIn, useSession } from "next-auth/react";

const SignIn = () => {
  const { data } = useSession();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={data ? () => void signOut() : () => void signIn()}
      >
        {data ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default SignIn;
