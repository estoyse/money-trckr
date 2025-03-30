import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Accounts from "./accounts";
import Overview from "./overview";
import RecentTransactions from "./recentTransactions";
import CreateRecord from "./createRecord";
import History from "./history";

const Dashboard = () => {
  return (
    <div className="p-2 lg:p-6 lg:pt-2 max-w-7xl mx-auto w-full">
      <Overview />
      <Accounts />
      <CreateRecord />
      <Tabs defaultValue="history" className="w-full mt-4">
        <TabsList className="w-full">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <History />
        </TabsContent>
        <TabsContent value="recent">
          <RecentTransactions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
