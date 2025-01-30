import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "../supabaseProvider";
import Accounts from "./accounts";
import Overview from "./overview";
import RecentTransactions from "./recentTransactions";
import { UserOverview } from "@/lib/types";

const Dashboard = () => {
  const supabase = useSupabase();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<UserOverview>({
    expenses: 0,
    income: 0,
    totalBalance: 0,
    totalTransactions: 0,
    accounts: [],
  });
  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("expenses, income, totalBalance, totalTransactions, accounts");

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
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className='p-2 lg:p-6 lg:pt-2 max-w-7xl mx-auto w-full'>
      <Overview data={data} loading={loading} />
      <Accounts data={data} loading={loading} />
      <RecentTransactions />
      {/* <ExpenseList /> */}
    </div>
  );
};

export default Dashboard;
