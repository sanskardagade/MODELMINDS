"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function UserProjects() {
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
    return <div className="text-center py-8 text-gray-400">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="bg-black border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">My Projects</h2>
        <p className="text-gray-400">No projects assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-black border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">My Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-black border-2 border-gray-300 rounded-lg overflow-hidden hover:border-gray-100 transition-colors"
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
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
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
                    {project._count?.images || 0} image
                    {project._count?.images !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {project._count?.workLogs || 0} work log
                    {project._count?.workLogs !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


