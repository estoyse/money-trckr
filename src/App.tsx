import { ThemeProvider } from "./components/common/theme-provider";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router>
        <Routes />
      </Router>
      <Toaster richColors position='top-center' />
    </ThemeProvider>
  );
}

export default App;
