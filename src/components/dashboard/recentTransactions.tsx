import { useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Transaction } from "@/lib/types";
import { useAtom } from "jotai";
import { notificationsAtom } from "@/state/atoms";
import TransactionModal from "./transactionModal";

const RecentTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useAtom(notificationsAtom);
  const [total, setTotal] = useState(0);

  const calculateTotal = (data: Transaction[]) => {
    return data.reduce((a, b) => {
      if (b.type === 3) return a + b.amount;
      return a - b.amount;
    }, 0);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
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
        setTotal(calculateTotal(data));
      }
      setLoading(false);
    };
    // Initial fetch
    fetchNotifications();

    // Set up real-time subscription
    const subscription: RealtimeChannel = supabase
      .channel("notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        payload => {
          setTransactions(currentTransactions => {
            const newTransaction: Transaction = payload.new as Transaction; // Assuming payload.new contains the new transaction
            const updatedTransactions = [
              ...currentTransactions,
              newTransaction,
            ];
            setTotal(calculateTotal(updatedTransactions));
            return updatedTransactions;
          });
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [setTransactions]);

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
                <TableCell colSpan={2} className='text-center'>
                  No recent transactions
                </TableCell>
              </TableRow>
            ) : (
              transactions.map(transaction => (
                <TransactionModal
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            )}
          </TableBody>
          <TableFooter>
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
          </TableFooter>
        </Table>
      </Card>
    </div>
  );
};

export default RecentTransactions;
