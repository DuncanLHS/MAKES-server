import { type Key } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const fetchKey = async (data: Pick<Key, "discordUserId">) => {
  const response = await fetch("/api/db/key", {
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch key");
  }

  const key = (await response.json()) as Key;
  return key;
};

export const useKeyQuery = (data: { discordUserId: string }) => {
  return useQuery({
    queryKey: ["/api/db/key", data],
    queryFn: () => fetchKey(data),
  });
};

export const upsertKey = async (
  params: Pick<Key, "rfid" | "discordUserId">
) => {
  try {
    console.log(params);
    const response = await fetch("/api/db/key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to upsert key");
    }

    const data = (await response.json()) as Key;
    return data; // Assuming the API returns the updated key data
  } catch (error) {
    throw new Error((error as Error).message || "Upsert Key Failed");
  }
};

export const useUpsertKey = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Pick<Key, "rfid" | "discordUserId">,
    Error,
    Pick<Key, "rfid" | "discordUserId">
  >(upsertKey, {
    // On successful mutation, invalidate the "keys" query to refetch data
    onError: (error) => {
      console.log(error);
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["/api/db/key"] });
    },
  });
};
