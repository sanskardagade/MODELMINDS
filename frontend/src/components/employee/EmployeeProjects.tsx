"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function EmployeeProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "ongoing" | "completed">("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employee/projects", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "ongoing") return project.progressPercent < 100;
    if (filter === "completed") return project.progressPercent === 100;
    return true;
  });

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === "all"
              ? "bg-gray-300 text-black"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          All Projects
        </button>
        <button
          onClick={() => setFilter("ongoing")}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === "ongoing"
              ? "bg-gray-300 text-black"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Ongoing
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === "completed"
              ? "bg-gray-300 text-black"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-black border border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-400">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-black border border-gray-300 rounded-lg overflow-hidden hover:border-gray-100 transition-colors"
            >
              {project.images && project.images[0] && (
                <div className="relative w-full h-48">
                  <Image
                    src={project.images[0].imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 text-sm">Progress</span>
                  <span className="text-white font-semibold">
                    {project.progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                  <div
                    className="bg-gray-300 h-2 rounded-full transition-all"
                    style={{ width: `${project.progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>
                    {project._count?.workLogs || 0} work log
                    {project._count?.workLogs !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {project.images?.length || 0} image
                    {project.images?.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {project.workLogs && project.workLogs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Recent Activity:</p>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {project.workLogs[0].workDone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

