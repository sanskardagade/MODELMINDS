"use client";
import Navbar from "@/components/Navbar";

export default function ProjectsPage() {
  // Create a grid of empty placeholders (10 items for 5 rows x 2 columns)
  const placeholders = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="py-8 px-4 sm:px-6">
      {/* Project Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8">
        {placeholders.map((index) => (
          <div
            key={index}
            className="relative aspect-[4/3] bg-black border-2 border-gray-300 hover:border-gray-100 hover:border-4 transition-all duration-300 cursor-pointer group"
          >
            {/* Empty placeholder - content will be added later */}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
