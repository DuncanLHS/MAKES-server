import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const User = async ({}) => {
  const session = await getServerSession(authOptions);
  const { user } = session || {};
  return (
    <div className="text-center text-2xl">
      {session && <div>Logged in as {user?.name}</div>}
      {session && <pre>User: {JSON.stringify(user, null, 4)}</pre>}
    </div>
  );
};

export default User;
