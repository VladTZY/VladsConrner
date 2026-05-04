"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { login } from "../../../lib/api";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email: "", password });
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#1c1917] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-mono text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            ← vlad's corner
          </Link>
        </div>

        <h1 className="text-3xl font-medium text-stone-900 dark:text-stone-100 mb-2 tracking-tight">
          admin
        </h1>
        <p className="text-sm font-mono text-stone-400 dark:text-stone-500 mb-10">
          enter your password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-stone-400 dark:text-stone-500" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-sm border border-stone-200 dark:border-stone-700 bg-transparent pl-10 pr-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs font-mono text-red-500 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-sm bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-sm font-medium hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
