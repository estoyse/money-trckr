import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Accounts from "./accounts";
import Overview from "./overview";
import RecentTransactions from "./recentTransactions";
import CreateRecord from "./createRecord";
import History from "./history";
import {
  accountsAtom,
  accountsLoadingAtom,
  accountsErrorAtom,
} from "@/state/atoms";

const Dashboard = () => {
  const setAccounts = useSetAtom(accountsAtom);
  const setLoading = useSetAtom(accountsLoadingAtom);
  const [error, setError] = useAtom(accountsErrorAtom);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_accounts")
        .select("id, name, balance, icon, created_at, owner");
      if (error) {
        setError(error);
      } else {
        setAccounts(data);
      }
      setLoading(false);
    };

    // Initial fetch
    fetchAccounts();
  }, [setAccounts, setError, setLoading]);

  if (error) {
    toast.error(error?.message);
  }

  return (
    <div className='p-2 lg:p-6 lg:pt-2 max-w-7xl mx-auto w-full'>
      <Overview />
      <Accounts />
      <CreateRecord />
      <Tabs defaultValue='history' className='w-full mt-4'>
        <TabsList className='w-full'>
          <TabsTrigger value='history'>History</TabsTrigger>
          <TabsTrigger value='recent'>Recent</TabsTrigger>
        </TabsList>
        <TabsContent value='history'>
          <History />
        </TabsContent>
        <TabsContent value='recent'>
          <RecentTransactions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
