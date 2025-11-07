import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/hero.png" // Place this image in /public folder
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      {/* Foreground Content */}
      <div className="text-center text-white px-4">
        {/* <h1 className="text-5xl font-bold text-blue-400 underline mb-4 drop-shadow-lg">
          ModelMinds
        </h1> */}
        <p className="text-3xl font-semibold mb-6 drop-shadow-md max-w-2xl mx-auto">
          “Bringing architecture to life with photorealistic designs, interiors,
          and cinematic walkthroughs.”
        </p>
        {/* <ThemeToggle /> */}
      </div>
    </div>
  );
}
