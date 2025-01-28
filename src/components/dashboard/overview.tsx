import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserOverview } from "@/lib/types";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightLeftIcon,
  WalletIcon,
} from "lucide-react";

export default function Overview({
  data,
  loading,
}: {
  data: UserOverview;
  loading: boolean;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(amount);
  };

  const getColorClass = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-secondary-foreground";
  };

  return (
    <div>
      <h2 className='text-4xl font-bold pb-2'>Overview</h2>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-md font-medium'>Expenses</CardTitle>
            <ArrowDownIcon className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getColorClass(-data.expenses)}`}
            >
              {formatCurrency(-data.expenses)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-md font-medium'>Income</CardTitle>
            <ArrowUpIcon className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getColorClass(data.income)}`}>
              {formatCurrency(data.income)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-md font-medium'>Total Balance</CardTitle>
            <WalletIcon className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getColorClass(
                data.totalBalance
              )}`}
            >
              {formatCurrency(data.totalBalance)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-md font-medium'>
              Total Transactions
            </CardTitle>
            <ArrowRightLeftIcon className='h-4 w-4 text-purple-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-300'>
              {data.totalTransactions}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
