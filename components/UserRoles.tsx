import DiscordRole from "@/components/DiscordRole";
import { getRoleDetails } from "@/lib/discord";

interface UserRolesProps {
  roleIds: string[];
}

const UserRoles = async ({ roleIds }: UserRolesProps) => {
  const roles = await getRoleDetails(roleIds);
  if (!roles)
    return (
      <span className="text-muted-foreground">
        <em>Failed to fetch roles</em>
      </span>
    );
  return (
    <div className={"flex flex-wrap gap-2"}>
      {roles.map((role) => (
        <DiscordRole role={role} key={role.id} />
      ))}
    </div>
  );
};

export default UserRoles;
