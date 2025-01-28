import { Building2, CirclePlus, CreditCard, Landmark } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { UserOverview } from "@/lib/types";

const Accounts = ({ data }: { data: UserOverview }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  const Icon = ({ name }: { name: string }) => {
    switch (name) {
      case "LandMark":
        return <Landmark />;
      case "Building2":
        return <Building2 />;
      case "CreditCard":
        return <CreditCard />;
      default:
        return null;
    }
  };
  return (
    <div>
      <h2 className='text-2xl font-semibold py-2'>Accounts</h2>

      <Card className='divide-y divide-border grid grid-cols-1 lg:grid-cols-2 lg:divide-x text-xl overflow-hidden'>
        {data.accounts.map(account => (
          <div
            key={account.id}
            className='flex items-center justify-between p-4 cursor-pointer'
          >
            <div className='flex items-center gap-3'>
              <Icon name={account.icon} />
              <span>{account.name}</span>
            </div>
            <div className='text-green-500'>
              so'm {formatCurrency(account.balance)}
            </div>
          </div>
        ))}
        <div
          className={cn(
            "flex items-center justify-center p-4 cursor-pointer ",
            `${data.accounts.length % 2 === 0 ? "lg:col-span-2" : ""}`
          )}
        >
          <div className='flex items-center gap-3'>
            <CirclePlus className='h-5 w-5 text-gray-400' />
            <span>Add Card</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Accounts;
