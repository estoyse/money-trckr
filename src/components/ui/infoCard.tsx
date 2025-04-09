import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Skeleton } from "./skeleton";
import { useNavigate } from "react-router-dom";
import formatNumber from "@/lib/formatCurrency";
type InfoCardProps = {
  title: string;
  icon: React.ElementType;
  value: number;
  loading: boolean;
  color: string;
  path?: string;
};
const InfoCard = ({
  title,
  icon: Icon,
  value,
  loading,
  color,
  path,
}: InfoCardProps) => {
  const getColorClass = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-secondary-foreground";
  };
  const navigate = useNavigate();
  return (
    <Card
      className='hover:bg-muted/75 cursor-pointer'
      onClick={() => {
        navigate(path || "");
      }}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-md font-medium'>{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getColorClass(value)}`}>
          {loading ? (
            <Skeleton className='h-8' />
          ) : title !== "Total Transactions" ? (
            formatNumber(value)
          ) : (
            value
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default InfoCard;
