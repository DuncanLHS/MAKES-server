import React from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/Avatar";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { getServerSession } from "next-auth";

const UserProfileIcon = () => {
  const { data } = useSession();

  if (!data || !data.user.image) return null;
  const {
    user: { image },
  } = data;

  return (
    <Avatar>
      <AvatarImage src={image} alt="user discord profile" />
      <AvatarFallback>{data.user.nick ?? data.user.name}</AvatarFallback>
    </Avatar>
  );
};

// const UserProfileIcon = async () => {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user.image) return null;
//   const {
//     user: { image },
//   } = session;

//   return (
//     <Avatar>
//       <AvatarImage src={image} alt="User discord profile" />
//     </Avatar>
//   );
// };

export default UserProfileIcon;
