import { Routes as RouterRoutes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Login from "./components/auth/login";
import { useEffect, useState } from "react";
import supabase from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import SignUp from "./components/auth/sign-up";
import ForgotPassword from "./components/auth/forgot";
import ChangePassword from "./components/auth/change-password";

export default function Routes() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  const fetchSession = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
  };

  useEffect(() => {
    setLoading(true);
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Separate effect for redirection
  useEffect(() => {
    const allowedRoutes = ["/sign-up", "/login", "/forgot"];
    if (loading) return; // Avoid running if session hasn't been checked yet

    if (!session && !allowedRoutes.includes(window.location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [session, navigate, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <RouterRoutes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login session={session} />} />
      <Route path="/sign-up" element={<SignUp session={session} />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </RouterRoutes>
  );
}
