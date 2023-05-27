import SignIn from "./components/SignIn";
import User from "./components/User";

function page() {
  return (
    <main className="flex flex-grow flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <SignIn />
      {/* @ts-expect-error server component */}
      <User />
    </main>
  );
}

export default page;
