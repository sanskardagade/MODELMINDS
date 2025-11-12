"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Services() {
  const services = [
    {
      title: "Architectural Visualization",
      desc: "Transforming blueprints into breathtaking realities — where form, light, and texture converge to tell stories of space.",
      img: "/architecture.png",
    },
    {
      title: "Interior Visualization",
      desc: "Experience the soul of interiors before they exist — curated ambiance, mood, and materials in photoreal precision.",
      img: "/interior.png",
    },
    {
      title: "Walkthroughs",
      desc: "Immerse yourself in cinematic journeys through yet-to-be-built worlds — a symphony of design, motion, and atmosphere.",
      img: "/walkthrough.png",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-[#F2F2F2] flex flex-col items-center">
      {/* Services Grid */}
      <section className="max-w-6xl w-full py-24 px-6 grid md:grid-cols-3 gap-10">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="relative group cursor-pointer overflow-hidden rounded-2xl bg-[#0D0D0D] border border-[#1C1C1C] 
                       shadow-[0_0_25px_rgba(249,115,22,0.3)] 
                       hover:shadow-[0_0_40px_rgba(249,115,22,0.6)]
                       transition-all duration-700"
          >
            <div className="relative h-[400px] w-full overflow-hidden">
              <Image
                src={s.img}
                alt={s.title}
                fill
                className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>
            <div className="absolute bottom-10 left-8 right-8 text-[#F2F2F2] z-10">
              <h2 className="text-2xl font-semibold tracking-wide mb-3 text-[#B6B09F] group-hover:text-[#B6B09F] transition-all duration-300">
                {s.title}
              </h2>
              <p className="text-sm leading-relaxed text-[#B2BEB5]">
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Closing CTA */}
      <section className="text-center py-28 bg-black">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold tracking-wide text-[#EAE4D5]"
        >
          REFINED VISION MEETS EXTRAORDINARY
          <span className="text-[#f97316]"> EXECUTION</span>
        </motion.h2>

        <p className="mt-6 text-[#B6B09F] max-w-2xl mx-auto">
          Every image we create reflects a commitment to craftsmanship, artistry,
          and immersive storytelling — let’s bring your architectural dreams to life.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ backgroundColor: "#f97316", color: "#ffffff" }}
          className="mt-10 px-10 py-3 border border-[#848884] bg-[#848884] text-white hover:bg-[#f97316] hover:border-[#f97316] active:bg-[#f97316] transition-all rounded-full font-medium"
        >
          START YOUR PROJECT
        </motion.button>
      </section>
    </div>
  );
}
