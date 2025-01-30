import { UserOverview } from "@/lib/types";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightLeftIcon,
  WalletIcon,
} from "lucide-react";
import InfoCard from "../ui/infoCard";
import { ModeToggle } from "../mode-toggle";

export default function Overview({
  data,
  loading,
}: {
  data: UserOverview;
  loading: boolean;
}) {
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
