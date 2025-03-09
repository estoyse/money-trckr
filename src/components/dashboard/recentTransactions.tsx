import { useCallback, useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";
import TransactionDetails from "./TransactionDetails";

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

const RecentTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);

  const calculateTotal = (data: Transaction[]) => {
    return data.reduce((a, b) => {
      if (b.type === 3) return a + b.amount;
      return a - b.amount;
    }, 0);
  };

  const fetchNotifications = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Set up real-time subscription
    const subscription: RealtimeChannel = supabase
      .channel("notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          switch (payload.eventType) {
            case "DELETE":
              setTransactions((currentTransactions) => {
                const updatedTransactions: Transaction[] =
                  currentTransactions.filter(
                    (transaction) => transaction.id !== payload.old.id,
                  );
                setTotal(calculateTotal(updatedTransactions));
                return updatedTransactions;
              });
              break;

            case "INSERT":
              setTransactions((currentTransactions) => {
                const newTransaction: Transaction = payload.new as Transaction; // Assuming payload.new contains the new transaction
                const updatedTransactions = [
                  ...currentTransactions,
                  newTransaction,
                ];
                setTotal(calculateTotal(updatedTransactions));
                return updatedTransactions;
              });
              break;

            case "UPDATE":
              setTransactions((currentTransactions) => {
                const updatedTransaction: Transaction =
                  payload.new as Transaction; // Assuming payload.new contains the updated transaction
                const updatedTransactions = currentTransactions.map(
                  (transaction) =>
                    transaction.id === updatedTransaction.id
                      ? updatedTransaction
                      : transaction,
                );
                setTotal(calculateTotal(updatedTransactions));
                return updatedTransactions;
              });
              break;

            default:
              break;
          }
        },
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchNotifications]);

  return (
    <div>
      <h2 className="text-2xl font-semibold py-2">Recent transactions</h2>
      <Card>
        <Table className="rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Transfer Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No recent transactions
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TransactionDetails
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
