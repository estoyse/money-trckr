import { GalleryVerticalEnd } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import Spinner from "../ui/spinner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendResetEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://money-trckr.netlify.app/change-password",
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
    if (!error) {
      toast.info("Email sent successfully");
      setLoading(false);
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Money Trckr
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Reset your password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your
                password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={sendResetEmail}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={loading}
                  >
                    {loading && <Spinner size={1} />}
                    Send
                  </Button>

                  <div className="text-center text-sm">
                    Back to{" "}
                    <Link to="/login" className="underline underline-offset-4">
                      login
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
