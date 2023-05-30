import { getGuilds } from "@/lib/discord";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ServerCard from "@/components/ServerCard";

const guilds = async () => {
  return await getGuilds();
};

const page = async () => {
  const guildArr = await guilds();
  const session = await getServerSession(authOptions);
  if (!guildArr)
    return (
      <p className="text-destructive-foreground">
        Error fetching discord servers. Please try again later.
      </p>
    );

  if (guildArr.length === 0)
    return (
      <p className="text-destructive-foreground">
        Bot is not a member of any of your servers.
      </p>
    );

  if (!session) {
    return (
      <p className="text-destructive-foreground">
        You must be logged in to see your servers.
      </p>
    );
  }

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
