import { useEffect } from "react";
import supabase from "@/lib/supabase";
import { useAtom, useAtomValue } from "jotai";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightLeftIcon,
  WalletIcon,
} from "lucide-react";
import InfoCard from "@/components/ui/infoCard";
import { ModeToggle } from "@/components/common/mode-toggle";
import {
  accountsAtom,
  userOverviewAtom,
  userOverviewLoadingAtom,
} from "@/state/atoms";

export default function Overview() {
  const [userOverview, setUserOverview] = useAtom(userOverviewAtom);
  const [loading, setLoading] = useAtom(userOverviewLoadingAtom);
  const accounts = useAtomValue(accountsAtom);

  useEffect(() => {
    const fetchUserOverview = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("expenses, income, total_balance, total_transactions");
      if (error) {
        console.log(error);
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

  return (
    <div>
      <div className='flex flex-row items-center justify-between'>
        <h2 className='text-4xl font-bold pb-2'>Overview</h2>
        <ModeToggle />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2'>
        <InfoCard
          title='Expenses'
          icon={ArrowDownIcon}
          value={-userOverview.expenses}
          loading={loading}
          color='red'
          path='/expenses'
        />
        <InfoCard
          title='Income'
          icon={ArrowUpIcon}
          value={userOverview.income}
          loading={loading}
          color='green'
          path='/income'
        />
        <InfoCard
          title='Total Balance'
          icon={WalletIcon}
          value={accounts.reduce((acc, account) => acc + account.balance, 0)}
          loading={loading}
          color='blue'
        />
        <InfoCard
          title='Total Transactions'
          icon={ArrowRightLeftIcon}
          value={userOverview.totalTransactions}
          loading={loading}
          color='gray'
        />
      </div>
    </div>
  );
}
