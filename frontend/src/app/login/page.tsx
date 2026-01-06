"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const role = data.data.user.role;
        if (role === "HEAD") {
          router.push("/admin");
        } else if (role === "EMPLOYEE") {
          router.push("/employee");
        } else if (role === "USER") {
          router.push("/user");
        } else {
          router.push("/");
        }
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check if the server is running.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="relative w-5 h-5">
            <div className="absolute left-0 top-0 w-[2px] h-full bg-white"></div>
            <div className="absolute right-0 top-0 w-[2px] h-full bg-white"></div>
            <div className="absolute left-[60%] top-0 w-[1px] h-3/4 bg-white"></div>
            <div className="absolute left-0 top-0 w-full h-[1px] bg-white"></div>
            <div className="absolute left-0 bottom-0 w-full h-[1px] bg-white"></div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white text-xl font-normal tracking-tight">Model</span>
            <span className="text-white text-xl font-normal tracking-tight">
              Minds<span className="text-red-500">.</span>
            </span>
          </div>
        </div>

        <div className="bg-black border border-gray-300 rounded-lg p-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100 transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-gray-300 rounded focus:outline-none focus:border-gray-100 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


