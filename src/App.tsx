import { ThemeProvider } from "./components/common/theme-provider";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "sonner";
import Routes from "./routes";
import { Toaster } from "@/components/ui/sonner";
import useAccounts from "@/hooks/useAccounts";
import useUserOverview from "@/hooks/useUserOverview";
import useHistory from "@/hooks/useHistory";

function App() {
  const { error } = useAccounts();
  const { error: userOverviewError } = useUserOverview();
  const { error: historyError } = useHistory();

  if (error || userOverviewError || historyError) {
    toast.error(
      error?.message || userOverviewError?.message || historyError?.message
    );
  }
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router>
        <Routes />
      </Router>
      <Toaster richColors position='bottom-center' />
    </ThemeProvider>
  );
}

export default App;
