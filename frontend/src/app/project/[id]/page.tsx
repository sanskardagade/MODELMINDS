"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      // Fetch public project details
      const projectRes = await fetch(
        `http://localhost:5000/api/public/projects/${projectId}`
      );
      const projectData = await projectRes.json();

      if (projectData.success) {
        setProject(projectData.data.project);
        setImages(projectData.data.project.images || []);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="text-center py-12">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          href="/"
          className="mb-4 inline-block text-gray-400 hover:text-white text-sm sm:text-base"
        >
          ← Back to Home
        </Link>

        {project && (
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{project.name}</h1>
            {project.description && (
              <p className="text-gray-400 text-sm sm:text-base">{project.description}</p>
            )}
            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm">
              <div>
                <span className="text-gray-400">Progress: </span>
                <span className="text-white">{project.progressPercent}%</span>
              </div>
              {project.dealAmount > 0 && (
                <div>
                  <span className="text-gray-400">Deal Amount: </span>
                  <span className="text-white">
                    ₹{project.dealAmount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {images.map((img: any) => (
            <div
              key={img.id}
              className="relative aspect-square bg-black border-2 border-gray-300 rounded overflow-hidden group cursor-pointer"
            >
              <Image
                src={img.imageUrl}
                alt="Project image"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No images available for this project
          </div>
        )}
      </div>
    </div>
  );
}

