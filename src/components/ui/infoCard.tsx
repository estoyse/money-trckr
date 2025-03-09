import { formatCurrency } from "@/lib/formatCurrency";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Skeleton } from "./skeleton";
type InfoCardProps = {
  title: string;
  icon: React.ElementType;
  value: number;
  loading: boolean;
  color: string;
};
const InfoCard = ({
  title,
  icon: Icon,
  value,
  loading,
  color,
}: InfoCardProps) => {
  const getColorClass = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-secondary-foreground";
  };
  return (
    <Card className="hover:bg-muted/75 cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getColorClass(value)}`}>
          {loading ? (
            <Skeleton className="h-8" />
          ) : title !== "Total Transactions" ? (
            formatCurrency(value)
          ) : (
            value
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default InfoCard;
