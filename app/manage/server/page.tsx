import { getGuilds } from "@/lib/discord";
import ServerCard from "@/components/ServerCard";
import { env } from "process";
import { type Server } from "@prisma/client";

const getServer = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const server = await fetch(`${env.API_URL!}/api/db/server`, {
    next: { tags: ["server"] },
  }).then((res) => {
    if (res.ok) return res.json() as Promise<Server>;
    else return null;
  });
  return server;
};

const page = async () => {
  const guildArr = await getGuilds();
  const server = await getServer();

  if (!guildArr || !server)
    return (
      <p className="text-destructive-foreground">
        Error fetching discord servers. Please try again later.
      </p>
    );

  if (guildArr.length === 0)
    return (
      <p className="text-destructive-foreground">
        Bot is not a member of any servers.
      </p>
    );

  return (
    <main className="mx-auto flex h-screen max-w-6xl flex-grow flex-col p-4">
      <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Servers
      </h1>
      <section className="flex flex-wrap gap-4">
        {guildArr.map((guild) => {
          return <ServerCard guild={guild} key={guild.id} server={server} />;
        })}
      </section>
    </main>
  );
};

export default page;
