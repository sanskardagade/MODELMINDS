"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const insights = [
  {
    title: "RARITY, ELEGANCE and ITALIA: The Mastery of Marble Sculpting",
    category: "Insight",
    image: "/images/marble.jpg",
    description:
      "An artistic journey through Italian craftsmanship that celebrates the timeless beauty of marble.",
  },
  {
    title:
      "From Architecture to Atmosphere: Inside Westminster’s Luxury Penthouses",
    category: "Insight",
    image: "/images/westminster.jpg",
    description:
      "A behind-the-scenes look at how modern design meets classic sophistication in London's skyline.",
  },
  {
    title: "The ModelMinds Edit: Sustainable Luxury Design Trends for 2025",
    category: "Insight",
    image: "/images/luxury.jpg",
    description:
      "How conscious design and refined materials are shaping the future of sustainable interiors.",
  },
  {
    title: "Studio Perks: Inside Careers and Culture at ModelMinds",
    category: "Insight",
    image: "/images/studio.jpg",
    description:
      "Discover the creative energy and collaborative spirit that fuel every project at ModelMinds.",
  },
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F2F2]">
      <Navbar />
      <div className="px-4 sm:px-6 md:px-16 py-12 sm:py-16 md:py-20">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto text-center mb-12 sm:mb-16 md:mb-20"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
          The <span className="text-[#EAE4D5]">World</span> of{" "}
          <span className="text-[#FFBF00]">ModelMinds</span>
        </h1>
        <p className="text-[#B6B09F] text-sm sm:text-base md:text-lg leading-relaxed px-4">
          A collection of narratives, from our own reflections to those told by
          esteemed industry peers — capturing the essence of our work and the
          inspirations behind it.
        </p>
      </motion.div>

      {/* INSIGHTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto">
        {insights.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="border border-[#B6B09F] rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md shadow-lg hover:shadow-[#f97316]/40 transition-all"
          >
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 sm:p-6">
              <p className="uppercase text-xs sm:text-sm text-[#EAE4D5] font-semibold tracking-wider mb-2">
                {item.category}
              </p>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-[#F2F2F2]">
                {item.title}
              </h2>
              <p className="text-[#B6B09F] text-xs sm:text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Updated Button */}
              {/* <button className="px-5 py-2 bg-[#848884] text-white rounded-lg hover:bg-[#f97316] active:bg-[#f97316] hover:text-white transition duration-300 shadow-md hover:shadow-[#f97316]/50">
                Read Insight →
              </button> */}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CALL TO ACTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-12 sm:mt-16 md:mt-24 px-4"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[#EAE4D5]">
          Join the World of{" "}
          <span className="text-[#FFBF00]">ModelMinds</span>
        </h2>
        <p className="text-[#B6B09F] mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
          Subscribe to join our community and stay up to date with our creative
          studio and its latest insights.
        </p>

        <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-lg mx-auto w-full">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-2/3 px-4 py-3 rounded-lg bg-black border border-[#B6B09F] text-[#F2F2F2] placeholder-[#B6B09F] focus:border-[#EAE4D5] outline-none transition"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#848884] text-white hover:bg-[#FFBF00] active:bg-[#FFBF00] hover:text-white transition duration-300 shadow-md hover:shadow-[#f97316]/50"
          >
            Subscribe
          </button>
        </form>
      </motion.div>
      </div>
    </div>
  );
}
