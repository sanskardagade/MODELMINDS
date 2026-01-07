"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import UserProjects from "@/components/user/UserProjects";
import UserChat from "@/components/user/UserChat";
import UserMoney from "@/components/user/UserMoney";
import UserProjectStatus from "@/components/user/UserProjectStatus";

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("projects");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data.user);
        } else {
          // If not authenticated, redirect to login
          router.push("/login");
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        router.push("/login");
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if logout fails
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Client Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {user && (
              <span className="text-gray-400 text-sm sm:text-base">Welcome, {user.name}</span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-300 overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-2 px-3 sm:px-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === "projects"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            My Projects
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`pb-2 px-3 sm:px-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === "chat"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Chat with Admin
          </button>
          <button
            onClick={() => setActiveTab("money")}
            className={`pb-2 px-3 sm:px-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === "money"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Money
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`pb-2 px-3 sm:px-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === "status"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Project Status
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "projects" && <UserProjects />}
          {activeTab === "chat" && <UserChat />}
          {activeTab === "money" && <UserMoney />}
          {activeTab === "status" && <UserProjectStatus />}
        </div>
      </div>
    </div>
  );
}


