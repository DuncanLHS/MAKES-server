import { User, getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import Image from "next/image";
import { prisma } from "prisma/db";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { type FC } from "react";
import UserRoles from "./UserRoles";
import { getRoleDetails } from "@/lib/discord";

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
  if (!user) return null;
  return (
    <Card>
      {!user ? null : (
        <CardContent className="flex min-w-full flex-col rounded-lg p-4">
          <CardTitle>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              My Profile
            </h2>
          </CardTitle>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <Image
              className="m-2 rounded-lg"
              src={user?.image ?? ""}
              width={120}
              height={120}
              alt="profile image"
            />
            <div className="block">
              <ProfileItem id="name" label="Name">
                {user.name}
              </ProfileItem>
              <ProfileItem id="nick" label="Server Nickname">
                {user.nick ?? <em>Not set</em>}
              </ProfileItem>
            </div>
            {/* <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {user?.nick ?? user?.name}
            </h3> */}
          </CardHeader>
          <div className="flex flex-col">
            <ProfileItem id="email" label="Email">
              {user?.email}
            </ProfileItem>
            <ProfileItem id="is-visible" label={`Show name on Who's In`}>
              {await isVisible(user)}
            </ProfileItem>
            <ProfileItem id="roles" label="Roles">
              {user.roles ? (
                // @ts-expect-error server component
                <UserRoles roleIds={user.roles} />
              ) : null}
            </ProfileItem>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

interface ProfileItemProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

export const ProfileItem: FC<ProfileItemProps> = ({ id, label, children }) => {
  return (
    <>
      <label htmlFor={id}>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {label}
        </h4>
      </label>
      <span id={id} className="ml-4 text-sm text-muted-foreground">
        {children}
      </span>
    </>
  );
};

export default User;
