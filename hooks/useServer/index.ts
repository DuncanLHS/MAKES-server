import { type Server } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const fetchServer = async () => {
  const response = await fetch("/api/db/server");
  const roles = (await response.json()) as Server;
  return roles;
};

export const useServer = () => {
  return useQuery(["/api/db/server"], fetchServer);
};
