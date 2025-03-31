import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDate } from "@/lib/formatDate";
import supabase from "@/lib/supabase";
import { Transaction } from "@/lib/types";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "../ui/table";
import { transactionTypeParser } from "@/lib/transactionTypeParser";
import { useAtomValue } from "jotai";
import { accountsAtom } from "@/state/atoms";

export default function History() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const accounts = useAtomValue(accountsAtom);

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
    <div>
      <h2 className='text-2xl font-semibold py-2'>History</h2>
      <Card>
        <Table className='rounded-lg'>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>Transfer Type</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className='h-8' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8' />
                  </TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className='text-center'>
                  No recent transactions
                </TableCell>
              </TableRow>
            ) : (
              transactions.map(transaction => (
                <TableRow key={transaction.id} className='cursor-pointer'>
                  <TableCell className='w-8'>
                    <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400'>
                      {transaction.icon}
                    </div>
                  </TableCell>
                  <TableCell className='flex flex-col'>
                    <span className='text-semibold'>
                      {transaction.location}
                    </span>
                    <span className='text-muted-foreground'>
                      {formatDate(transaction.transaction_date)}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex flex-col items-end'>
                      <span
                        className={`${
                          transaction.type !== 3
                            ? "text-red-500"
                            : "text-green-500"
                        } `}
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                      <span className='text-muted-foreground'>
                        {transactionTypeParser(transaction.type)} (
                        {
                          accounts.find(
                            account => account.id === transaction.account
                          )?.name
                        }
                        )
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell
                className={`text-right ${
                  total > 0
                    ? "text-green-500"
                    : total == 0
                    ? "text-card-foreground"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(total)}
              </TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </Card>
    </div>

    // <Card className=''>
    //   <div className='divide-y'>
    //     {loading ? (
    //       Array.from({ length: 5 }).map((_, index) => (
    //         <div key={index} className='flex items-start gap-4 p-4'>
    //           <Skeleton className='h-10 w-10 rounded-full' />

    //           <Skeleton className='h-4 w-2/3' />

    //           <div className='flex flex-col w-1/3 gap-2 place-items-end'>
    //             <Skeleton className='h-4  w-full' />
    //             <Skeleton className='h-4 w-1/2' />
    //           </div>
    //         </div>
    //       ))
    //     ) : transactions.length === 0 ? (
    //       <div className='p-4 text-muted-foreground text-center'>
    //         No recent transactions
    //       </div>
    //     ) : (
    //       transactions.map((transaction, index) => (
    //         <div key={index} className='flex items-start gap-4 p-4'>
    //           <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400'>
    //             {transaction.icon}
    //           </div>
    //           <div className='flex-1 min-w-0'>
    //             <p className='text-lg font-semibold text-white'>
    //               {transaction.location}
    //             </p>
    //             <div className='flex gap-2 items-center text-sm text-gray-500'>
    //               <p>{formatDate(transaction.transaction_date)}</p>
    //             </div>
    //           </div>
    //           <div className='flex-shrink-0'>
    //             <p className='text-red-500 font-medium whitespace-nowrap'>
    //               {formatCurrency(transaction.amount)}
    //             </p>
    //           </div>
    //         </div>
    //       ))
    //     )}
    //   </div>
    // </Card>
  );
}
