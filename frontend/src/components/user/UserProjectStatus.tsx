"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function UserProjectStatus() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/projects", {
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

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading project status...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="bg-black border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Project Status</h2>
        <p className="text-gray-400">No projects assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-300 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Project Status</h2>
      <p className="text-gray-400 text-sm mb-6">
        View the completion status of your projects. Status is updated by the admin.
      </p>

      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border-2 border-gray-700 rounded-lg p-6 hover:border-gray-500 transition-colors"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Project Image */}
              {project.images && project.images[0] && (
                <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                  <Image
                    src={project.images[0].imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Project Details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-gray-400 text-sm mb-4">
                    {project.description}
                  </p>
                )}

                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Completion Status</span>
                    <span className="text-white font-semibold text-lg">
                      {project.progressPercent}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-gray-300 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${project.progressPercent}%` }}
                    ></div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.progressPercent === 100
                          ? "bg-green-500/20 text-green-300 border border-green-500"
                          : project.progressPercent >= 50
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500"
                      }`}
                    >
                      {project.progressPercent === 100
                        ? "Completed"
                        : project.progressPercent >= 50
                        ? "In Progress"
                        : "Not Started"}
                    </span>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Work Logs</p>
                      <p className="text-white font-semibold text-sm sm:text-base">
                        {project._count?.workLogs || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Images</p>
                      <p className="text-white font-semibold text-sm sm:text-base">
                        {project._count?.images || 0}
                      </p>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-500 text-xs">
                      Last updated:{" "}
                      {new Date(project.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


