import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, AlertCircle, ArrowRight, Loader2, ShieldAlert } from "lucide-react";

import { useRegisterMutation } from "../../features/auth/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        role: "member",
      }).unwrap();

      dispatch(
        setCredentials({
          user: response.user,
          token: response.token,
        })
      );

      navigate("/member/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error);
      const msg =
        error?.data?.message ||
        error?.error ||
        "Registration failed. Please check your details and try again.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-4 py-8">
      <Card className="w-full max-w-md shadow-xl border-slate-200/80">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            <BookOpen className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create a Member Account
          </CardTitle>
          <CardDescription className="text-sm">
            Join the Smart Library System as a student or library member
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-5 flex items-center gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Password (min 8 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="pl-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register as Member
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>

          {/* <div className="p-3 bg-muted/60 border border-border/70 rounded-lg text-xs flex items-start gap-2 text-left">
            <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              <strong>Staff & Administrators:</strong> Administrative accounts cannot be self-registered. Please{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>{" "}
              using your assigned librarian credentials.
            </span>
          </div> */}
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;