import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface Transaction {
  id: number;
  date: string;
  name: string;
  amount: number;
  narration: string;
}

export function useGetTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getAllTransactions();
      return raw.map(
        (
          t: { date: string; name: string; amount: number; narration: string },
          idx: number,
        ) => ({
          id: idx,
          date: t.date,
          name: t.name,
          amount: t.amount,
          narration: t.narration,
        }),
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      date: string;
      name: string;
      amount: number;
      narration: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addTransaction(
        data.date,
        data.name,
        data.amount,
        data.narration,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useDeleteTransaction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteTransaction(BigInt(id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}
