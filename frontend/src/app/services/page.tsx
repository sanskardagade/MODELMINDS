"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Services() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Exterior Section */}
      <section className="w-full py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-white space-y-4">
            <p className="text-base leading-relaxed">
              Experience your project in its future environment before a single
              shovel breaks ground. We generate cinematic exterior perspectives,
              grounded in realistic lighting, landscaping, and atmospheric
              conditions, ensuring flawless presentation.
            </p>
          </div>

          {/* Image with Overlay */}
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/architecture.png"
              alt="Exterior Visualization"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 right-0 p-6">
              <h2 className="text-6xl md:text-7xl font-bold text-white">
                Exterior
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Interior Section */}
      <section className="w-full py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-white space-y-4 md:order-2">
            <p className="text-base leading-relaxed">
              Craft an emotional connection before construction begins. Our
              interior renders are meticulously detailed experiences, providing
              architects and designers the ultimate tool for client communication
              and design refinement.
            </p>
          </div>

          {/* Image with Overlay */}
          <div className="relative aspect-[4/3] w-full md:order-1">
            <Image
              src="/interior.png"
              alt="Interior Visualization"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 right-0 p-6">
              <h2 className="text-6xl md:text-7xl font-bold text-white">
                Interior
              </h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
