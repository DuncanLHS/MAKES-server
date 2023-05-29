import React from "react";
import User from "../../components/User";

const page = () => {
  return (
    <main className="prose flex h-screen max-w-full flex-grow flex-col items-center justify-center">
      {/* @ts-expect-error server component */}
      <User />
    </main>
  );
};

export default page;
