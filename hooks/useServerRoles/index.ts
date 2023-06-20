import { useQuery } from "@tanstack/react-query";
import { type APIRole } from "discord-api-types/v10";

export const fetchGuildRoles = async () => {
  const response = await fetch("/api/discord/guild-roles");
  const roles = (await response.json()) as APIRole[];
  return roles;
};

export const useGuildRoles = () => {
  return useQuery(["GuildRoles"], fetchGuildRoles);
};
