import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Accounts from "./accounts";
import Overview from "./overview";
import RecentTransactions from "./recentTransactions";
import CreateRecord from "./createRecord";
import History from "./history";
import useAccounts from "@/hooks/useAccounts";
import useUserOverview from "@/hooks/useUserOverview";
import useHistory from "@/hooks/useHistory";
import { toast } from "sonner";

const Dashboard = () => {
  const { error } = useAccounts();
  const { error: userOverviewError } = useUserOverview();
  const { error: historyError } = useHistory();

  if (error || userOverviewError || historyError) {
    toast.error(
      error?.message || userOverviewError?.message || historyError?.message
    );
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
