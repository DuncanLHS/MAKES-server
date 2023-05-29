import { getServerSession } from "next-auth";
import SignInWithDiscord from "../components/SignInWithDiscord";
import { authOptions } from "./api/auth/[...nextauth]/route";

async function page() {
  const session = await getServerSession(authOptions);
  const content = () => {
    if (session) {
      const { name, nick } = session?.user;
      return <h2>{`Welcome ${nick ?? (name as string)}`}</h2>;
    }
    return (
      <>
        <h1>MAKES</h1>
        <h3>Please sign in</h3>
        <SignInWithDiscord />
      </>
    );
  };

  return (
    <main className="prose flex max-w-full flex-grow flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-600">
      {content()}
    </main>
  );
}

export default page;
