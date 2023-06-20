import { getGuilds } from "@/lib/discord";
import ServerCard from "@/components/ServerCard";

const page = async () => {
  const guildArr = await getGuilds();
  if (!guildArr)
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
          return <ServerCard guild={guild} key={guild.id} />;
        })}
      </section>
    </main>
  );
};

export default page;
