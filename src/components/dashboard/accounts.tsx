import {
  Building2,
  ChevronRight,
  CirclePlus,
  CreditCard,
  Landmark,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import supabase from "@/lib/supabase";
import { Skeleton } from "../ui/skeleton";
import { useAtom, useAtomValue } from "jotai";
import { accountsAtom, accountsLoadingAtom } from "@/state/atoms";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Accounts = () => {
  const Icon = ({ name }: { name: string }) => {
    switch (name) {
      case "LandMark":
        return <Landmark />;
      case "Building2":
        return <Building2 />;
      case "CreditCard":
        return <CreditCard />;
      default:
        return null;
    }
  };
  const navigate = useNavigate();
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const loading = useAtomValue(accountsLoadingAtom);

  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cardName, setCardName] = useState("");
  const [initialBalance, setInitialBalance] = useState<number | "">("");

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { data: addedCard, error } = await supabase
        .from("user_accounts")
        .insert({
          name: cardName,
          balance: +initialBalance,
          icon: "CreditCard",
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      setAccounts(prev => [...prev, addedCard]);

      setOpen(false);
      setCardName("");
      setInitialBalance(0);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className='text-2xl font-semibold py-2'>Accounts</h2>

      <Card className='divide-y divide-border grid grid-cols-1 lg:grid-cols-2 lg:divide-x text-xl overflow-hidden'>
        {loading ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 lg:divide-x'>
            {[1, 2, 3, 4].map(i => (
              <Skeleton
                key={i}
                className='flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50'
              />
            ))}
          </div>
        ) : (
          accounts.map(account => (
            <div
              key={account.id}
              className='flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50'
              onClick={() => navigate(`/account/${account.id}`)}
            >
              <div className='flex items-center gap-3'>
                <Icon name={account.icon} />
                <span>{account.name}</span>
              </div>
              <div className='flex items-center gap-3'>
                <span
                  className={
                    account.balance > 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {formatCurrency(account.balance)}
                </span>
                <ChevronRight />
              </div>
            </div>
          ))
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div
              className={`flex items-center justify-center p-4 cursor-pointer hover:bg-muted/50 ${
                accounts.length % 2 === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <button className='flex items-center gap-3 cursor-pointer'>
                <CirclePlus className='h-5 w-5 text-gray-400' />
                <span>Add Card</span>
              </button>
            </div>
          </DialogTrigger>
          <DialogContent className='rounded-lg'>
            <DialogHeader>
              <DialogTitle>Add Card</DialogTitle>
              <DialogDescription>
                Make changes to transaction details here. Click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid items-start gap-y-2 mb-4'>
                <Label htmlFor='amount'>Card Name</Label>
                <Input
                  id='amount'
                  type='text'
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className='col-span-3'
                  autoFocus={false}
                />
              </div>
              <div className='grid items-start gap-y-2 mb-4'>
                <Label htmlFor='amount'>Initial Card Balance</Label>
                <Input
                  id='amount'
                  type='number'
                  className='col-span-3'
                  value={initialBalance}
                  onChange={e =>
                    setInitialBalance(
                      e.target.value === "" ? "" : +e.target.value
                    )
                  }
                  autoFocus={false}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Spinner />}
                Add Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default Accounts;
