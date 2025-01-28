import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("expenses, income, totalBalance, totalTransactions, accounts");

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }
    console.log(data);
    if (data) {
      setData(data[0] as UserOverview);
    } else {
      // Handle the case when no data is found
      console.log("No user data found");
      // Keep the default values set in useState
    }

    setLoading(false);
  };

  return (
    <div className='p-2 lg:p-6 lg:pt-2 max-w-7xl mx-auto'>
      <Overview data={data} loading={loading} />
      <Accounts data={data} loading={loading} />
      <RecentTransactions />
    </div>
  );
};

export default Dashboard;
