import { useCallback, useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import Accounts from "./accounts";
import Overview from "./overview";
import RecentTransactions from "./recentTransactions";
import { UserOverview } from "@/lib/types";
import supabase from "@/lib/supabase";

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<UserOverview>({
    expenses: 0,
    income: 0,
    totalBalance: 0,
    totalTransactions: 0,
  });
  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("expenses, income, totalBalance, totalTransactions");

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }
    if (data) {
      setData(data[0] as UserOverview);
    } else {
      // Handle the case when no data is found
      console.log("No user data found");
      // Keep the default values set in useState
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up real-time subscription
    const subscription: RealtimeChannel = supabase
      .channel("user_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
        },
        (payload) => {
          setData(payload.new as UserOverview);
        },
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchData]);

  return (
    <div className="p-2 lg:p-6 lg:pt-2 max-w-7xl mx-auto w-full">
      <Overview data={data} loading={loading} />
      <Accounts />
      <RecentTransactions />
      {/* <ExpenseList /> */}
    </div>
  );
};

export default Dashboard;
