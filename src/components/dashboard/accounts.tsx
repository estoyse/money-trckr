import { Building2, CirclePlus, CreditCard, Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserOverview } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatCurrency";

const Accounts = ({
  data,
  loading,
}: {
  data: UserOverview;
  loading: boolean;
}) => {
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
      <h2 className="text-2xl font-semibold py-2">Accounts</h2>

      {loading ? (
        <Card className="text-xl overflow-hidden">
          <Skeleton className="h-40 w-full" />
        </Card>
      ) : (
        <Card className="divide-y divide-border grid grid-cols-1 lg:grid-cols-2 lg:divide-x text-xl overflow-hidden">
          {data.accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Icon name={account.icon} />
                <span>{account.name}</span>
              </div>
              <div className="text-green-500">
                {formatCurrency(account.balance)}
              </div>
            </div>
          ))}
          <div
            className={`flex items-center justify-center p-4 cursor-pointer hover:bg-muted/50 ${
              data.accounts.length % 2 === 0 ? "lg:col-span-2" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <CirclePlus className="h-5 w-5 text-gray-400" />
              <span>Add Card</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Accounts;
