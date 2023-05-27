import React from "react";
import User from "../components/User";

const page = () => {
  return (
    <main className="prose flex max-w-full flex-grow flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-600">
      {/* @ts-expect-error server component */}
      <User />
    </main>
  );
};

export default page;
