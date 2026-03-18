"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-orange">
          Home
        </Link>{" "}
        &rsaquo; <span className="text-foreground">Login</span>
      </nav>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="font-heading text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Username or E-mail
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded border border-gray-300 focus:border-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded border border-gray-300 focus:border-orange focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="rounded" />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember Me
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-orange w-full disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
