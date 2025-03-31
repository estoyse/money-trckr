import { Account, Transaction, UserOverview } from "@/lib/types";
import { PostgrestError } from "@supabase/supabase-js";
import { atom } from "jotai";

export const accountsAtom = atom<Account[]>([]);
export const accountsLoadingAtom = atom(true);
export const accountsErrorAtom = atom<PostgrestError | null>(null);

export const notificationsAtom = atom<Transaction[]>([]);
export const historyAtom = atom<Transaction[]>([]);
export const historyLoadingAtom = atom(true);

export const userOverviewAtom = atom<UserOverview>({
  expenses: 0,
  income: 0,
  totalBalance: 0,
  totalTransactions: 0,
});
export const userOverviewLoadingAtom = atom(true);
