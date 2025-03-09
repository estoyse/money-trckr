import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./components/dashboard";
import LoginPage from "./components/login";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";
import { Session } from "@supabase/supabase-js";

export default function RouterIndex() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    setLoading(false);

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Separate effect for redirection
  useEffect(() => {
    if (session === undefined) return; // Avoid running if session hasn't been checked yet
    if (session === null) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [session, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
