import { Account, Transaction } from "@/lib/types";
import { PostgrestError } from "@supabase/supabase-js";
import { atom } from "jotai";

export const accountsAtom = atom<Account[]>([]);
export const accountsLoadingAtom = atom(true);
export const accountsErrorAtom = atom<PostgrestError | null>(null);
export const notificationsAtom = atom<Transaction[]>([]);
