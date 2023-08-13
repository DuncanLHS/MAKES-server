import { type Machine } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const updateMachine = async (data: Partial<Machine>) => {
  const response = await fetch("/api/db/machine", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  } else {
    const machine = (await response.json()) as Machine;
    return machine;
  }
};

export const useMachineMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: Partial<Machine>) => updateMachine(data), {
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["/api/db/machine"] });
    },
    onError: (error) => {
      void queryClient.invalidateQueries({ queryKey: ["/api/db/machine"] });
    },
  });
};
