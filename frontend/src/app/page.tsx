"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const teamMembers = [
    {
      name: "Aarav Patel",
      role: "Lead Architect",
      image: "/team1.png", // Replace with your portrait image
      bio: "Designs with innovation and precision, blending art with structure.",
    },
    {
      name: "Priya Sharma",
      role: "3D Visualization Expert",
      image: "/team2.png",
      bio: "Transforms concepts into immersive, photorealistic experiences.",
    },
    {
      name: "Rohan Mehta",
      role: "Interior Designer",
      image: "/team3.png",
      bio: "Creates elegant interiors that harmonize comfort and style.",
    },
    {
      name: "Simran Kaur",
      role: "Project Manager",
      image: "/team4.png",
      bio: "Ensures seamless execution from design to delivery.",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section (unchanged) */}
      <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="/hero.png"
          alt="Background"
          fill
          className="object-cover -z-10"
          priority
        />
        <div className="absolute inset-0 bg-black/50 -z-10" />
        <div className="text-center text-white px-4">
          <p className="text-3xl font-semibold mb-6 drop-shadow-md max-w-2xl mx-auto">
            “Bringing architecture to life with photorealistic designs,
            interiors, and cinematic walkthroughs.”
          </p>
        </div>
      </div>

      {/* Team Section */}
      <section className="bg-black text-white py-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-5xl font-bold mb-16 tracking-wide text-[#f97316]"
        >
          OUR TEAM
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-[#111] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_40px_#f97316] transition-all duration-500 flex flex-col items-center text-center"
            >
              <div className="relative w-64 h-80 mt-6 rounded-xl overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#f97316] mb-1">
                  {member.name}
                </h3>
                <p className="text-[#EAE4D5] text-sm mb-3">{member.role}</p>
                <p className="text-[#B6B09F] text-sm">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
