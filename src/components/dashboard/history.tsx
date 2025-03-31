import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDate } from "@/lib/formatDate";
import supabase from "@/lib/supabase";
import { Transaction } from "@/lib/types";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function History() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("history")
        .select("*")
        .order("transaction_date", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }
      if (data) {
        setTransactions(data);
      }
      setLoading(false);
    };
    // Initial fetch
    fetchHistory();
  }, []);

  return (
    <Card className=''>
      <div className='divide-y'>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='flex items-start gap-4 p-4'>
              <Skeleton className='h-10 w-10 rounded-full' />

              <Skeleton className='h-4 w-2/3' />

              <div className='flex flex-col w-1/3 gap-2 place-items-end'>
                <Skeleton className='h-4  w-full' />
                <Skeleton className='h-4 w-1/2' />
              </div>
            </div>
          ))
        ) : transactions.length === 0 ? (
          <div className='p-4 text-muted-foreground text-center'>
            No recent transactions
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <div key={index} className='flex items-start gap-4 p-4'>
              <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400'>
                {transaction.icon}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-lg font-semibold text-white'>
                  {transaction.location}
                </p>
                <div className='flex gap-2 items-center text-sm text-gray-500'>
                  <p>{formatDate(transaction.transaction_date)}</p>
                </div>
              </div>
              <div className='flex-shrink-0'>
                <p className='text-red-500 font-medium whitespace-nowrap'>
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
