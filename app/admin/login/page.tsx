"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Microscope, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else if (result?.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100/80 dark:bg-[#070A0E] p-4 transition-colors">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#0D1217]">
        <CardHeader className="space-y-3 text-center pb-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-gradient-to-br from-emerald-600 to-[#0E3B2F] text-white p-3 rounded-2xl shadow-md">
              <Microscope className="w-7 h-7" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Supplement<span className="text-emerald-600 dark:text-emerald-400">Decoded</span>
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Editorial & Review Console
            </p>
          </div>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white pt-2">
            Administrator Sign In
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to manage evidence monographs, reviews, and clinical guides
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={isLoading}
                required
                autoFocus
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs tracking-wide transition-all shadow-md active:scale-98 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating…
                </>
              ) : (
                "Sign In to Console"
              )}
            </Button>

            <div className="text-center text-xs text-slate-400 dark:text-slate-400 pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1.5">
              <p>Default credentials: <span className="font-mono text-slate-600 dark:text-slate-300">admin</span> / <span className="font-mono text-slate-600 dark:text-slate-300">admin123</span></p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ username: "admin", password: "admin123" })}
                className="text-xs h-7 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 border-slate-200 dark:border-slate-800"
              >
                Auto-Fill Credentials
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
