"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F2F2] flex flex-col items-center justify-center px-6 py-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl md:text-6xl font-bold mb-10 text-center tracking-wide"
      >
        Contact Our<span className="text-[#f97316]"> Team</span>
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
        {/* Utkarsh Kashliwal */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="border border-[#B6B09F] rounded-2xl p-8 bg-black/30 backdrop-blur-lg shadow-lg hover:shadow-orange-500/40 transition-all"
        >
          <h2 className="text-3xl font-semibold text-[#f97316] mb-4">
            Utkarsh Kasliwal
          </h2>
          <p className="text-[#B6B09F] mb-6">
            Passionate about innovation, technology, and impactful solutions.
            Reach out for collaborations or project discussions.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:utkarsh@example.com"
              className="flex items-center gap-3 hover:text-[#EAE4D5] transition"
            >
              <Mail className="w-5 h-5 text-orange-500" /> utkarsh@example.com
            </a>
            <a
              href="https://linkedin.com/in/utkarsh"
              target="_blank"
              className="flex items-center gap-3 hover:text-[#EAE4D5] transition"
            >
              <Linkedin className="w-5 h-5 text-orange-500" /> linkedin.com/in/utkarsh
            </a>
            <p className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-orange-500" /> +91 98765 43210
            </p>
          </div>
        </motion.div>

        {/* Deepak */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="border border-[#B6B09F] rounded-2xl p-8 bg-black/30 backdrop-blur-lg shadow-lg hover:shadow-orange-500/40 transition-all"
        >
          <h2 className="text-3xl font-semibold text-[#f97316] mb-4">
            Deepak
          </h2>
          <p className="text-[#B6B09F] mb-6">
            Focused on building seamless digital experiences and reliable systems.
            Connect for tech or product-based opportunities.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:deepak@example.com"
              className="flex items-center gap-3 hover:text-[#EAE4D5] transition"
            >
              <Mail className="w-5 h-5 text-orange-500" /> deepak@example.com
            </a>
            <a
              href="https://linkedin.com/in/deepak"
              target="_blank"
              className="flex items-center gap-3 hover:text-[#EAE4D5] transition"
            >
              <Linkedin className="w-5 h-5 text-orange-500" /> linkedin.com/in/deepak
            </a>
            <p className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-orange-500" /> +91 98765 43211
            </p>
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-[#B6B09F] text-center max-w-xl"
      >
        We value meaningful connections. Drop us a message or connect through
        LinkedIn to collaborate on something extraordinary.
      </motion.p>
    </div>
  );
}
