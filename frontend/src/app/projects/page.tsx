"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

// temporary sample data
const sampleProjects = [
  {
    title: "Westminster Penthouse",
    category: "Residential",
    image: "/sample-project.jpg",
    driveLink: "https://drive.google.com/",
  },
  {
    title: "Mayfair Luxury Suite",
    category: "Commercial",
    image: "/sample2.jpg",
    driveLink: "https://drive.google.com/",
  },
  {
    title: "Marble Elegance Villa",
    category: "Interior",
    image: "/sample3.jpg",
    driveLink: "https://drive.google.com/",
  },
];

export default function ProjectsPage() {
  const [clicked, setClicked] = useState(false);
  const data = { projects: sampleProjects };

  return (
    <div className="min-h-screen bg-black text-[#F2F2F2] py-20 px-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold text-center mb-16 tracking-wide text-[#EAE4D5]"
      >
        OUR <span className="text-[#f97316]">PROJECTS</span>
      </motion.h1>

      {/* Project Grid */}
      <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {data.projects.map((p, i) => (
          <motion.a
            href={p.driveLink}
            key={i}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            className="relative group overflow-hidden rounded-2xl bg-[#111] border border-[#1C1C1C] shadow-[0_0_25px_rgba(249,115,22,0.3)]"
          >
            <div className="relative h-[350px] w-full overflow-hidden">
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <h2 className="text-xl font-semibold text-[#fffff]">
                {p.title}
              </h2>
              <p className="text-sm text-[#B6B09F]">{p.category}</p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* CTA Section */}
      <section className="text-center mt-24">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold tracking-wide text-[#EAE4D5]"
        >
          EVERY PROJECT IS A STORY OF VISION & CRAFT
        </motion.h2>
        <p className="mt-6 text-[#B6B09F] max-w-2xl mx-auto">
          Explore spaces that blend imagination, technology, and art — crafted
          with precision, emotion, and innovation.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setClicked(true)}
          className={`mt-10 px-10 py-3 border rounded-full transition-all duration-300 ${
            clicked
              ? "bg-[#f97316] border-[#f97316] text-black"
              : "border-[#848884] text-[#848884] hover:bg-[#848884] hover:text-black"
          }`}
        >
          VIEW MORE
        </motion.button>
      </section>
    </div>
  );
}
