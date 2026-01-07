"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch public projects with images
    fetch("http://localhost:5000/api/public/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.data.projects || []);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] bg-black border-2 border-gray-300 hover:border-gray-100 hover:border-4 transition-all duration-300"
              >
                {/* Empty placeholder */}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {projects.map((project: any) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="relative aspect-[4/3] bg-black border-2 border-gray-300 hover:border-gray-100 hover:border-4 transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                {project.images && project.images[0] && (
                  <Image
                    src={project.images[0].imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                    <h3 className="text-white font-semibold text-base sm:text-lg mb-1">
                      {project.name}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm">
                      {project._count?.images || 0} images
                      {project.progressPercent > 0 && (
                        <span className="ml-2">• {project.progressPercent}%</span>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
