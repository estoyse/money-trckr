import { useAtomValue } from "jotai";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, PencilLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { accountsAtom, historyAtom, historyLoadingAtom } from "@/state/atoms";
import { formatDate } from "@/lib/formatDate";
import { formatCurrency } from "@/lib/formatCurrency";
import Spinner from "./ui/spinner";

export default function TransactionDetails() {
  const { id } = useParams();
  const history = useAtomValue(historyAtom);
  const accounts = useAtomValue(accountsAtom);
  const loading = useAtomValue(historyLoadingAtom);

  if (loading) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }
  const currentTransaction = history.find(h => h.id === id)!;
  const currentAccount = accounts.find(
    a => a.id === currentTransaction.account
  )!;
  return (
    <div className='container mx-auto py-6 px-4 max-w-5xl'>
      <div className='flex items-center mb-6'>
        <Link
          to='/'
          className='flex items-center text-sm font-medium text-muted-foreground hover:text-primary'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Transactions
        </Link>
      </div>

      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Transaction {currentTransaction.id}
          </h1>
          <p className='text-muted-foreground'>
            {formatDate(currentTransaction?.transaction_date || "")}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button>
            <PencilLine className='h-4 w-4 mr-2' />
            Edit
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Transaction ID
                </h3>
                <p className='font-medium'>{currentTransaction.id}</p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Status
                </h3>
                <Badge
                  variant='default'
                  className='bg-green-100 text-green-800 hover:bg-green-100'
                >
                  Completed
                </Badge>
              </div>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Date
                </h3>
                <div className='flex items-center'>
                  <Calendar className='h-4 w-4 mr-2 text-muted-foreground' />
                  <p>{formatDate(currentTransaction.transaction_date)}</p>
                </div>
              </div>

              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Payment Method
                </h3>
                <p>{currentAccount.name}</p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Description
                </h3>
                <p>{currentTransaction.description || "No description"}</p>
              </div>
            </div>

            <Separator className='my-4' />

            <div>
              <h3 className='text-sm font-medium mb-2'>Items</h3>
              <div className='rounded-md border'>
                <table className='min-w-full divide-y divide-border'>
                  <thead>
                    <tr className='bg-muted/50'>
                      <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Item
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Quantity
                      </th>
                      <th className='px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Price
                      </th>
                      <th className='px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-background divide-y divide-border'>
                    <tr>
                      <td className='px-4 py-3 whitespace-nowrap text-sm font-medium'>
                        No item name
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm'>1</td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-right'>
                        {formatCurrency(currentTransaction.amount)}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-sm text-right'>
                        {formatCurrency(currentTransaction.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between font-medium'>
                <span>Total</span>
                <span>{formatCurrency(currentTransaction.amount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Name
                </h3>
                <p>{currentTransaction.location}</p>
              </div>

              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Billing Address
                </h3>
                <p className='text-sm'>No location</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
