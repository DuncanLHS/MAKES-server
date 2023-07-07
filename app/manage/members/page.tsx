import MembersTable from "@/components/members/MembersTable";
import React from "react";

const page = () => {
  return (
    <main className="mx-auto flex h-screen max-w-6xl flex-grow flex-col p-4">
      <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Members
      </h1>
      <section className="flex flex-wrap gap-4">
        <MembersTable />
      </section>
    </main>
  );
};

export default page;
