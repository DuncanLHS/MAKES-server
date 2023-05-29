import { User, getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import Image from "next/image";
import { prisma } from "prisma/db";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
    <Card>
      {!user ? null : (
        <CardContent className="flex min-w-full flex-col rounded-lg p-4">
          <CardTitle>My Profile</CardTitle>
          <CardHeader className="flex flex-row items-center justify-between">
            <Image
              className="m-2 rounded-lg"
              src={user?.image ?? ""}
              width={100}
              height={100}
              alt="profile image"
            />
            <h3>{user?.nick ?? user?.name}</h3>
          </CardHeader>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <span id="email" className="ml-4 text-sm text-muted-foreground">
              {user?.email}
            </span>
            <label htmlFor="isVisible">{'Name me on "who\'s in"'}</label>
            <span id="isVisible" className="ml-4 text-sm text-muted-foreground">
              {await isVisible(user)}
            </span>
            <label htmlFor="roles">Roles</label>
            <span id="role" className="ml-4 text-sm text-muted-foreground">
              {user?.roles?.map((role) => (
                <div key={role}>{role}</div>
              ))}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default User;
