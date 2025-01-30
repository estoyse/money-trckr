import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./components/dashboard";
import { SupabaseProvider } from "./components/supabaseProvider";

function App() {
  return (
    <SupabaseProvider>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Router>
          {/* <BottomBar /> */}

          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/about' element={<About />} />
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </ThemeProvider>
    </SupabaseProvider>
  );
}

// Example components for routes
const About = () => <div>About Page</div>;

export default App;
