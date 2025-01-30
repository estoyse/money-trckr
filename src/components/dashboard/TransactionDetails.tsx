import { useState } from "react";
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

import type { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/formatCurrency";
import { transactionTypeParser } from "@/lib/transactionTypeParser";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

const TransactionDetails = ({ transaction }: { transaction: Transaction }) => {
  const [amount, setAmount] = useState(transaction.amount);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(transaction.location);
  const [type, setType] = useState(transaction.type);
  const [transactionDate, setTransactionDate] = useState(
    new Date(transaction.transaction_date)
  );
  const [open, setOpen] = useState(false);

  return (
    <Dialog key={transaction.id}>
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
                {formatCurrency(transaction.amount)}
              </span>
              <span className='text-muted-foreground'>
                {transactionTypeParser(transaction.type)} (Humo)
              </span>
            </div>
          </TableCell>
        </TableRow>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit and save</DialogTitle>
          <DialogDescription>
            Make changes to transaction details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid items-start gap-4'>
            <Label htmlFor='description'>Description (optional)</Label>
            <Input
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid items-start gap-4'>
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

          <div className='grid items-start gap-4'>
            <Label>Transaction Date</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className='flex gap-2 w-full justify-between'>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-1/2 justify-center text-left font-normal",
                      !transactionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {transactionDate ? (
                      formatDate(transactionDate.toString())
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-1/2 justify-center text-left font-normal",
                      !transactionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {transactionDate ? (
                      formatDate(transactionDate.toString())
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0 bg-popover' align='start'>
                <Calendar
                  mode='single'
                  selected={transactionDate}
                  onSelect={newDate => {
                    setTransactionDate(newDate as Date);
                    setOpen(false); // Close the popover when a date is selected
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='grid items-start gap-4'>
            <Label htmlFor='username'>Where</Label>
            <Input
              id='username'
              value={location}
              onChange={e => setLocation(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid items-start gap-4'>
            <Label htmlFor='type'>Transaction Type</Label>
            <Select onValueChange={value => setType(+value)}>
              <SelectTrigger className='w-[180px]' id='type'>
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
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TransactionDetails;
