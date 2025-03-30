import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightLeftIcon,
  WalletIcon,
} from "lucide-react";
import InfoCard from "@/components/ui/infoCard";
import { ModeToggle } from "@/components/common/mode-toggle";
import { useAtom, useAtomValue } from "jotai";
import {
  accountsAtom,
  userOverviewAtom,
  userOverviewLoadingAtom,
} from "@/state/atoms";

export default function Overview() {
  const [accounts] = useAtom(accountsAtom);
  const [userOverview] = useAtom(userOverviewAtom);
  const loading = useAtomValue(userOverviewLoadingAtom);

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
          value={-userOverview.expenses}
          loading={loading}
          color='red'
        />
        <InfoCard
          title='Income'
          icon={ArrowUpIcon}
          value={userOverview.income}
          loading={loading}
          color='green'
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
