import { useState } from "react";
import supabase from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TableRow, TableCell } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";

import { transactionTypeParser } from "@/lib/transactionTypeParser";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TimePicker } from "@/components/ui/clock";
import type { Transaction } from "@/lib/types";
import Spinner from "../ui/spinner";
import { toast } from "sonner";
import { accountsAtom, historyAtom, notificationsAtom } from "@/state/atoms";
import { useAtom, useSetAtom } from "jotai";
import formatNumber from "@/lib/formatCurrency";

const TransactionModal = ({
  transaction,
  setTotal,
}: {
  transaction: Transaction;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const setNotifications = useSetAtom(notificationsAtom);
  const setHistory = useSetAtom(historyAtom);

  const [amount, setAmount] = useState(transaction.amount);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(transaction.location);
  const [type, setType] = useState(transaction.type);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  const [transactionDate, setTransactionDate] = useState(
    new Date(transaction.transaction_date)
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    setLoading(true);
    if (!selectedAccountId) {
      toast.error("Please select an account");
      setLoading(false);
      return;
    }
    const { error } = await supabase.rpc("process_transaction", {
      notification_id: transaction.id,
      user_uuid: transaction.user_id,
      p_amount: amount,
      p_description: description,
      p_location: location,
      p_type: type,
      p_transaction_date: transactionDate,
      account_id: selectedAccountId,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    setNotifications(prev =>
      prev.filter(
        currentTransaction => currentTransaction.id !== transaction.id
      )
    );
    setHistory(prev =>
      [...prev, transaction].sort(
        (a, b) =>
          new Date(b.transaction_date).getTime() -
          new Date(a.transaction_date).getTime()
      )
    );
    setAccounts(prev =>
      prev.map(account =>
        account.id === selectedAccountId
          ? {
              ...account,
              balance:
                type === 3
                  ? account.balance + amount
                  : account.balance - amount,
            }
          : account
      )
    );
    setTotal(prev => {
      if (type === 3) return prev - amount;
      return prev + amount;
    });

    setOpen(false);
    setLoading(false);
  };
  return (
    <Dialog key={transaction.id} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TableRow className='cursor-pointer'>
          <TableCell className='flex flex-col'>
            <span className='text-semibold'>{transaction.location}</span>
            <span className='text-muted-foreground'>
              {formatDate(transaction.transaction_date)}
            </span>
          </TableCell>
          <TableCell className='text-right'>
            <div className='flex flex-col items-end'>
              <span
                className={`${
                  transaction.type !== 3 ? "text-red-500" : "text-green-500"
                } `}
              >
                {formatNumber(transaction.amount)}
              </span>
              <span className='text-muted-foreground'>
                {transactionTypeParser(transaction.type)} (Humo)
              </span>
            </div>
          </TableCell>
        </TableRow>
      </DialogTrigger>
      <DialogContent className='rounded-lg '>
        <DialogHeader>
          <DialogTitle>Edit and save</DialogTitle>
          <DialogDescription>
            Make changes to transaction details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Collapsible>
            <div className='grid items-start gap-y-2 mb-4'>
              <Label htmlFor='description'>Description (optional)</Label>
              <Input
                id='description'
                value={description}
                onChange={e => setDescription(e.target.value)}
                className='col-span-3'
              />
            </div>
            <div className='grid items-start gap-y-2'>
              <div className='flex gap-2'>
                <div className='w-1/2'>
                  <Label htmlFor='type'>Transaction Type</Label>
                  <Select onValueChange={value => setType(+value)}>
                    <SelectTrigger className='' id='type'>
                      <SelectValue placeholder={transactionTypeParser(type)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='3'>Topup</SelectItem>
                        <SelectItem value='2'>Transfer</SelectItem>
                        <SelectItem value='1'>Withdrawal</SelectItem>
                        <SelectItem value='0'>Expense</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className='w-1/2'>
                  <Label htmlFor='account'>Account</Label>
                  <Select
                    onValueChange={value => {
                      setSelectedAccountId(value);
                    }}
                  >
                    <SelectTrigger className='' id='account'>
                      <SelectValue placeholder='Select an account' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant='ghost' size='sm' className='w-full my-2'>
                <span>Edit other details</span>
                <ChevronsUpDown className='h-4 w-4' />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='grid items-start gap-y-2 mb-4'>
                <Label htmlFor='amount'>Amount</Label>
                <Input
                  id='amount'
                  type='number'
                  value={amount}
                  onChange={e => setAmount(+e.target.value)}
                  className='col-span-3'
                  autoFocus={false}
                />
              </div>
              <div className='grid items-start gap-y-2 mb-4'>
                <Label>Transaction Date</Label>
                <div className='flex gap-2'>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-1/2 justify-center text-left font-normal",
                          !transactionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {transactionDate ? (
                          formatDate(transactionDate.toString(), false)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto p-0 bg-popover'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={transactionDate}
                        onSelect={newDate => {
                          setTransactionDate(
                            new Date(
                              newDate!.getFullYear(),
                              newDate!.getMonth(),
                              newDate!.getDate(),
                              transactionDate.getHours(),
                              transactionDate.getMinutes(),
                              transactionDate.getSeconds(),
                              transactionDate.getMilliseconds()
                            )
                          );
                          setCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <TimePicker
                    date={transactionDate}
                    setDate={setTransactionDate}
                  />
                </div>
              </div>
              <div className='grid items-start gap-y-2 mb-4'>
                <Label htmlFor='username'>Where</Label>
                <Input
                  id='username'
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className='col-span-3'
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <DialogFooter>
          <Button onClick={onSave} disabled={loading}>
            {loading && <Spinner />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TransactionModal;
