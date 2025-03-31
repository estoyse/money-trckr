import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { historyAtom, historyLoadingAtom } from "@/state/atoms";
import { PostgrestError } from "@supabase/supabase-js";

// Create atoms for accounts state

const useHistory = () => {
  const [history, setHistory] = useAtom(historyAtom);
  const [loading, setLoading] = useAtom(historyLoadingAtom);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("history")
        .select("*")
        .order("transaction_date", { ascending: false });
      if (error) {
        setError(error);
      } else {
        setHistory(data);
      }
      setLoading(false);
    };

    // Initial fetch
    fetchHistory();
  }, [setHistory, setError, setLoading]);

  return { history, loading, error };
};

export default useHistory;
