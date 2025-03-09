import { ThemeProvider } from "./components/common/theme-provider";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
