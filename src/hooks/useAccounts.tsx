import supabase from "@/lib/supabase";
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
        .select("id, name, balance, icon, created_at, owner");
      if (error) {
        setError(error);
      } else {
        setAccounts(data);
      }
      setLoading(false);
    };

    // Initial fetch
    fetchAccounts();
  }, [setAccounts, setError, setLoading]);

  return { accounts, loading, error };
};

export default useAccounts;
