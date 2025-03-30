import { ThemeProvider } from "./components/common/theme-provider";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "sonner";
import Routes from "./routes";
import { Toaster } from "@/components/ui/sonner";
import useAccounts from "@/hooks/useAccounts";
import useUserOverview from "@/hooks/useUserOverview";

function App() {
  const { error } = useAccounts();
  const { error: userOverviewError } = useUserOverview();

  if (error || userOverviewError) {
    toast.error(error?.message || userOverviewError?.message);
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
