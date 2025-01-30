import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "../ui/card";
import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "../supabaseProvider";
import type { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/formatCurrency";
import { Skeleton } from "../ui/skeleton";
import TransactionDetails from "./TransactionDetails";

const RecentTransactions = () => {
  const supabase = useSupabase();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }
    if (data) {
      setTransactions(data);
      setTotal(
        data.reduce((a, b) => {
          if (b.type === 3) return a + b.amount;
          return a - b.amount;
        }, 0)
      );
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div>
      <h2 className='text-2xl font-semibold py-2'>Recent transactions</h2>
      <Card>
        <Table className='rounded-lg'>
          <TableHeader>
            <TableRow>
              <TableHead>Transfer Type</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-8' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-8' />
                    </TableCell>
                  </TableRow>
                ))
              : transactions.map(transaction => (
                  <TransactionDetails
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell
                className={`text-right text-${
                  total >= 0 ? "green" : "red"
                }-600`}
              >
                {formatCurrency(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </div>
  );
};

export default RecentTransactions;
