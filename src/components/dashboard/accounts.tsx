import { Building2, CirclePlus, CreditCard, Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Account } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState("");
  const [initialBalance, setInitialBalance] = useState<number | "">("");

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      const { data } = await supabase.from("user_accounts").select("*");
      setAccounts(data || []);
      setLoading(false);
    };
    fetchAccounts();
  }, []);

  const handleSave = async () => {
    const { data } = await supabase.auth.getUser();
    setIsSaving(true);

    try {
      const { error } = await supabase.from("user_accounts").insert({
        name: cardName,
        balance: initialBalance,
        user_id: data?.user?.id,
        icon: "CreditCard",
      });
      if (error) {
        toast.error(error.message);
      }
      setOpen(false);
      setCardName("");
      setInitialBalance(0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold py-2">Accounts</h2>

      {loading ? (
        <Card className="text-xl overflow-hidden grid grid-cols-2 gap-4">
          <Skeleton className="divide-y divide-border grid grid-cols-1 lg:grid-cols-2 lg:divide-x text-xl overflow-hidden h-16" />
          <Skeleton className="divide-y divide-border grid grid-cols-1 lg:grid-cols-2 lg:divide-x text-xl overflow-hidden h-16" />
          <Skeleton className="divide-y divide-border grid grid-cols-1 lg:grid-cols-2 lg:divide-x text-xl overflow-hidden h-16" />
          <Skeleton className="divide-y divide-border grid grid-cols-1 lg:grid-cols-2 lg:divide-x text-xl overflow-hidden h-16" />
          {/* <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" /> */}
        </Card>
      ) : (
        <Card className="divide-y divide-border grid grid-cols-1 lg:grid-cols-2 lg:divide-x text-xl overflow-hidden">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Icon name={account.icon} />
                <span>{account.name}</span>
              </div>
              <div className="text-green-500">
                {formatCurrency(account.balance)}
              </div>
            </div>
          ))}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div
                className={`flex items-center justify-center p-4 cursor-pointer hover:bg-muted/50 ${
                  accounts.length % 2 === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <button className="flex items-center gap-3 cursor-pointer">
                  <CirclePlus className="h-5 w-5 text-gray-400" />
                  <span>Add Card</span>
                </button>
              </div>
            </DialogTrigger>
            <DialogContent className="rounded-lg">
              <DialogHeader>
                <DialogTitle>Add Card</DialogTitle>
                <DialogDescription>
                  Make changes to transaction details here. Click save when
                  you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-start gap-y-2 mb-4">
                  <Label htmlFor="amount">Card Name</Label>
                  <Input
                    id="amount"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="col-span-3"
                    autoFocus={false}
                  />
                </div>
                <div className="grid items-start gap-y-2 mb-4">
                  <Label htmlFor="amount">Initial Card Balance</Label>
                  <Input
                    id="amount"
                    type="number"
                    className="col-span-3 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    value={initialBalance}
                    onChange={(e) =>
                      setInitialBalance(
                        e.target.value === "" ? "" : +e.target.value,
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
      )}
    </div>
  );
};

export default Accounts;
