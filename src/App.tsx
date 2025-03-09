import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router } from "react-router-dom";
import RouterIndex from "./RouterIndex";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <RouterIndex />
      </Router>
    </ThemeProvider>
  );
}

export default App;
