import supabase from "@/lib/supabase";
import { Account } from "@/lib/types";
import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  accountsAtom,
  accountsErrorAtom,
  accountsLoadingAtom,
} from "@/state/atoms";

// Create atoms for accounts state

const useAccounts = () => {
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const [loading, setLoading] = useAtom(accountsLoadingAtom);
  const [error, setError] = useAtom(accountsErrorAtom);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_accounts")
        .select("id, name, balance, icon");
      if (error) {
        setError(error);
      } else {
        setAccounts(data);
      }
      setLoading(false);
    };

    // Initial fetch
    fetchAccounts();

    // Setup real-time subscription for updates only
    const subscription = supabase
      .channel("user_accounts_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "user_accounts",
        },
        payload => {
          // Handle different event types
          switch (payload.eventType) {
            case "INSERT":
              setAccounts(current => [...current, payload.new as Account]);
              break;
            case "UPDATE":
              console.log(payload.new);
              setAccounts(current =>
                current.map(account =>
                  account.id === payload.new.id
                    ? (payload.new as Account)
                    : account
                )
              );
              break;
            case "DELETE":
              setAccounts(current =>
                current.filter(account => account.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [setAccounts, setError, setLoading]);

  return { accounts, loading, error };
};

export default useAccounts;
