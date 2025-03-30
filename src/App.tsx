import { ThemeProvider } from "./components/common/theme-provider";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import { Toaster } from "@/components/ui/sonner";
import useAccounts from "@/hooks/useAccounts";
import { toast } from "sonner";

function App() {
  const { error } = useAccounts();

  if (error) {
    toast.error(error.message);
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
