import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { CalendarIcon, CirclePlus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";
import supabase from "@/lib/supabase";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { formatDate } from "@/lib/formatDate";
import { Calendar } from "../ui/calendar";
import TimePicker from "../ui/clock";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "../ui/select";
import { transactionTypeParser } from "@/lib/transactionTypeParser";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { accountsAtom } from "@/state/atoms";

export default function CreateRecord() {
  const [accounts] = useAtom(accountsAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState(0);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id);
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTransactionDate(new Date());
    }
  }, [isOpen]);

  async function handleAddCard() {
    setIsSaving(true);
    try {
      if (!amount) throw new Error("Please enter an amount");
      if (!selectedAccountId) throw new Error("Please select an account");
      const { error } = await supabase.from("history").insert({
        account: selectedAccountId,
        amount: +amount,
        transaction_date: transactionDate,
        type,
        description,
        location,
      });
      if (error) {
        throw error;
      }
      setDescription("");
      setAmount("");
      setLocation("");
      setIsOpen(false);
      setSelectedAccountId("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
    setIsSaving(false);
  }

  return (
    <div>
      <h2 className='text-2xl font-semibold py-2'>Create a Record</h2>

      <Card className='divide-y divide-border grid grid-cols-1 lg:grid-cols-2 lg:divide-x text-xl overflow-hidden'>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className='flex items-center justify-center p-4 cursor-pointer hover:bg-primary/90 lg:col-span-2 bg-primary transition-colors'>
              <button className='flex items-center gap-3 cursor-pointer'>
                <CirclePlus className='h-5 w-5' />
                <span>Create Record</span>
              </button>
            </div>
          </DialogTrigger>
          <DialogContent className='rounded-lg'>
            <DialogHeader>
              <DialogTitle>Create a Transaction</DialogTitle>
              <DialogDescription>
                Enter details of the transaction here. Click Add when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid items-start gap-y-2 mb-4'>
                <Label htmlFor='description'>Description (optional)</Label>
                <Input
                  id='description'
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className='col-span-3'
                  autoComplete='off'
                />
              </div>
              <div className='grid items-start gap-y-2 mb-4'>
                <Label htmlFor='amount'>Amount</Label>
                <Input
                  id='amount'
                  type='number'
                  value={amount}
                  onChange={e =>
                    setAmount(e.target.value == "" ? "" : +e.target.value)
                  }
                  className='col-span-3'
                  autoFocus={false}
                  autoComplete='off'
                />
              </div>
              <div className='grid items-start gap-y-2 mb-4'>
                <Label>Transaction Date</Label>
                <div className='flex gap-2'>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className='w-1/2 justify-center text-left font-normal'
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
              <div className='grid items-start gap-y-2'>
                <div className='flex gap-2'>
                  <div className='w-1/2'>
                    <Label htmlFor='type'>Transaction Type</Label>
                    <Select onValueChange={value => setType(+value)}>
                      <SelectTrigger className='' id='type'>
                        <SelectValue
                          placeholder={transactionTypeParser(type)}
                        />
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
                      onValueChange={value => setSelectedAccountId(value)}
                    >
                      <SelectTrigger className='' id='account'>
                        <SelectValue
                          placeholder={
                            accounts.find(
                              account => account.id === selectedAccountId
                            )?.name || "Select an account"
                          }
                        />
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
            </div>
            <DialogFooter>
              <Button onClick={handleAddCard} disabled={isSaving}>
                {isSaving && <Spinner />}
                Add Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
