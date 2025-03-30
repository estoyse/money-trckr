import { useCallback, useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";
import { UserOverview } from "@/lib/types";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightLeftIcon,
  WalletIcon,
} from "lucide-react";
import InfoCard from "@/components/ui/infoCard";
import { ModeToggle } from "@/components/common/mode-toggle";

export default function Overview() {
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
      .select("expenses, income, total_balance, total_transactions");

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }
    if (data) {
      setData({
        ...data[0],
        totalTransactions: data[0].total_transactions,
        totalBalance: data[0].total_balance,
      });
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
    <div>
      <div className='flex flex-row items-center justify-between'>
        <h2 className='text-4xl font-bold pb-2'>Overview</h2>
        <ModeToggle />
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <InfoCard
          title='Expenses'
          icon={ArrowDownIcon}
          value={-data.expenses}
          loading={loading}
          color='red'
        />
        <InfoCard
          title='Income'
          icon={ArrowUpIcon}
          value={data.income}
          loading={loading}
          color='green'
        />
        <InfoCard
          title='Total Balance'
          icon={WalletIcon}
          value={data.totalBalance}
          loading={loading}
          color='blue'
        />
        <InfoCard
          title='Total Transactions'
          icon={ArrowRightLeftIcon}
          value={data.totalTransactions}
          loading={loading}
          color='gray'
        />
      </div>
    </div>
  );
}
