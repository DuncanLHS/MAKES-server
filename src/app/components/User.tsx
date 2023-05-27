import { User, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";
import { prisma } from "prisma/db";

const isVisible = async (user: User) => {
  return await prisma.profile
    .findUnique({
      where: {
        userId: user.id,
      },
      select: {
        isVisible: true,
      },
    })
    .then((res) => {
      console.log("isVisible", res);
      if (res === null) {
        return "Unknown";
      } else {
        return res.isVisible ? "Yes" : "No";
      }
    });
};

const User = async ({}) => {
  const session = await getServerSession(authOptions);
  const { user } = session || {};
  return (
    <div>
      <h1>My Profile</h1>
      {!user ? null : (
        <section className="flex min-w-full flex-col rounded-lg bg-neutral-200 p-4">
          <div className="flex flex-row items-center justify-between">
            <Image
              className="m-2 rounded-lg"
              src={user?.image ?? ""}
              width={100}
              height={100}
              alt="profile image"
            />
            <h3>{user?.nick ?? user?.name}</h3>
          </div>
          <div className="grid grid-cols-2">
            <span>Email</span>
            <span>{user?.email}</span>

            <span>{'Name me on "who\'s in"'}</span>
            <span>{await isVisible(user)}</span>
            <span>Roles</span>
            <span>
              {user?.roles?.map((role) => (
                <div key={role}>{role}</div>
              ))}
            </span>
          </div>
        </section>
      )}
    </div>
  );
};

export default User;
