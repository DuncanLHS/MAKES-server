import { type Server } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const fetchServer = async () => {
  const response = await fetch("/api/db/server");

  if (!response.ok) {
    throw new Error("Failed to fetch server");
  }

  const server = (await response.json()) as Server;
  return server;
};

export const updateServer = async (data: Partial<Server>) => {
  const response = await fetch("/api/db/server", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update server");
  } else {
    const server = (await response.json()) as Server;
    return server;
  }
};

export const useServerQuery = () => {
  return useQuery({
    queryKey: ["/api/db/server"],
    queryFn: fetchServer,
  });
};

export const useServerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: Partial<Server>) => updateServer(data), {
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["/api/db/server"] });
    },
    onError: (error) => {
      void queryClient.invalidateQueries({ queryKey: ["/api/db/server"] });
    },
  });
};
