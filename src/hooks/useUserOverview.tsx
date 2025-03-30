import supabase from "@/lib/supabase";
import { userOverviewAtom, userOverviewLoadingAtom } from "@/state/atoms";
import { PostgrestError } from "@supabase/supabase-js";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

const useUserOverview = () => {
  const [userOverview, setUserOverview] = useAtom(userOverviewAtom);
  const [error, setError] = useState<PostgrestError | null>(null);
  const setLoading = useSetAtom(userOverviewLoadingAtom);

  useEffect(() => {
    const fetchUserOverview = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("expenses, income, total_balance, total_transactions");
      if (error) {
        setError(error);
      } else {
        setUserOverview({
          ...data[0],
          totalBalance: data[0].total_balance,
          totalTransactions: data[0].total_transactions,
        });
      }
      setLoading(false);
    };

    // Initial fetch
    fetchUserOverview();
  }, [setUserOverview, setLoading]);

  return { userOverview, error };
};

export default useUserOverview;
