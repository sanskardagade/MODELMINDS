"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F2F2]">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 md:mb-10 text-center tracking-wide"
      >
        Contact <span className="text-[#FFBF00]"> Us</span>
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-5xl w-full">
        {/* Utkarsh Kashliwal */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="border border-[#FFBF00] rounded-2xl p-6 sm:p-8 bg-black/30 backdrop-blur-lg shadow-lg hover:shadow-yellow-500/40 transition-all"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#FFBF00] mb-3 sm:mb-4">
            Ar. Utkarsh Kasliwal
          </h2>
          <p className="text-[#B6B09F] mb-4 sm:mb-6 text-sm sm:text-base">
            Passionate about innovation, technology, and impactful solutions.
            Reach out for collaborations or project discussions.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:utkarsh@example.com"
              className="flex items-center gap-3 hover:text-[#FFBF00] transition"
            >
              <Mail className="w-5 h-5 text-yellow-500" /> utkarsh@example.com
            </a>
            <a
              href="https://linkedin.com/in/utkarsh"
              target="_blank"
              className="flex items-center gap-3 hover:text-[#FFBF00] transition"
            >
              <Linkedin className="w-5 h-5 text-yellow-500" /> linkedin.com/in/utkarsh
            </a>
            <p className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-yellow-500" /> +91 98765 43210
            </p>
          </div>
        </motion.div>

        {/* Deepak */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="border border-[#FFBF00] rounded-2xl p-6 sm:p-8 bg-black/30 backdrop-blur-lg shadow-lg hover:shadow-yellow-500/40 transition-all"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#FFBF00] mb-3 sm:mb-4">
            Deepak
          </h2>
          <p className="text-[#B6B09F] mb-4 sm:mb-6 text-sm sm:text-base">
            Focused on building seamless digital experiences and reliable systems.
            Connect for tech or product-based opportunities.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:deepak@example.com"
              className="flex items-center gap-3 hover:text-[#FFBF00] transition"
            >
              <Mail className="w-5 h-5 text-yellow-500" /> deepak@example.com
            </a>
            <a
              href="https://linkedin.com/in/deepak"
              target="_blank"
              className="flex items-center gap-3 hover:text-[#FFBF00] transition"
            >
              <Linkedin className="w-5 h-5 text-yellow-500" /> linkedin.com/in/deepak
            </a>
            <p className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-yellow-500" /> +91 98765 43211
            </p>
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 sm:mt-12 md:mt-16 text-[#B6B09F] text-center max-w-xl px-4 text-sm sm:text-base"
      >
        We value meaningful connections. Drop us a message or connect through
        LinkedIn to collaborate on something extraordinary.
      </motion.p>
      </div>
    </div>
  );
}
