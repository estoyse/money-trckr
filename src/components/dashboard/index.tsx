import { useCallback, useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Accounts from "./accounts";
import Overview from "./overview";
import RecentTransactions from "./recentTransactions";
import { UserOverview } from "@/lib/types";
import supabase from "@/lib/supabase";
import CreateRecord from "./createRecord";
import History from "./history";

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
        payload => {
          setData(payload.new as UserOverview);
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchData]);

  return (
    <div className='p-2 lg:p-6 lg:pt-2 max-w-7xl mx-auto w-full'>
      <Overview data={data} loading={loading} />
      <Accounts />
      <CreateRecord />
      <Tabs defaultValue='history' className='w-full mt-4'>
        <TabsList className='w-full'>
          <TabsTrigger value='history'>History</TabsTrigger>
          <TabsTrigger value='recent'>Recent</TabsTrigger>
        </TabsList>
        <TabsContent value='history'>
          <History />
        </TabsContent>
        <TabsContent value='recent'>
          <RecentTransactions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
