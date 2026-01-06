"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageUpload from "@/components/admin/ImageUpload";
import EmployeeManagement from "@/components/admin/EmployeeManagement";
import ProjectOverview from "@/components/admin/ProjectOverview";
import TaskAssignment from "@/components/admin/TaskAssignment";
import MoneyOverview from "@/components/admin/MoneyOverview";

export default function AdminDashboard() {
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
        }
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

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
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === "projects"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === "images"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Upload Images
          </button>
          <button
            onClick={() => setActiveTab("employees")}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === "employees"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === "tasks"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Assign Tasks
          </button>
          <button
            onClick={() => setActiveTab("money")}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === "money"
                ? "border-b-2 border-white text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Money
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "projects" && <ProjectOverview />}
          {activeTab === "images" && <ImageUpload />}
          {activeTab === "employees" && <EmployeeManagement />}
          {activeTab === "tasks" && <TaskAssignment />}
          {activeTab === "money" && <MoneyOverview />}
        </div>
      </div>
    </div>
  );
}

