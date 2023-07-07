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
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          M.A.K.E.S.
        </h1>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Please sign in
        </h3>
        <SignInWithDiscord />
      </>
    );
  };

  return (
    <main className="flex h-screen max-w-full flex-grow flex-col items-center justify-center">
      <section className="flex flex-col items-center gap-4">
        {content()}
      </section>
    </main>
  );
}

export default page;
