"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProjectOverview() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "ongoing" | "completed">("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects", {
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
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-gray-300 text-black"
              : "bg-gray-800 text-white"
          }`}
        >
          All Projects
        </button>
        <button
          onClick={() => setFilter("ongoing")}
          className={`px-4 py-2 rounded ${
            filter === "ongoing"
              ? "bg-gray-300 text-black"
              : "bg-gray-800 text-white"
          }`}
        >
          Ongoing
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded ${
            filter === "completed"
              ? "bg-gray-300 text-black"
              : "bg-gray-800 text-white"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Projects List */}
      <div className="bg-black border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Projects Overview</h2>
        
        {filteredProjects.length === 0 ? (
          <p className="text-gray-400">No projects found</p>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => window.location.href = `/admin/projects/${project.id}`}
                className="border border-gray-800 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {project.description || "No description"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      project.progressPercent === 100
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {project.progressPercent}%
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-400">Deal Amount:</span>
                    <p className="text-white">₹{project.dealAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Received:</span>
                    <p className="text-white">₹{project.receivedAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Pending:</span>
                    <p className="text-white">
                      ₹{(project.dealAmount - project.receivedAmount)?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-400">Assigned to:</span>
                      <p className="text-white">
                        {project.user?.name || "Not assigned"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Work Logs:</span>
                      <p className="text-white">{project._count?.workLogs || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

