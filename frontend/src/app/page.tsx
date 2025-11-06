import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white dark:bg-gray-100 dark:text-black transition-all duration-500">
      <h1 className="text-5xl font-bold text-blue-400 underline mb-4">
        ModelMinds 🌍
      </h1>
      <p className="text-lg mb-6">Innovating AI for the next generation.</p>
      <ThemeToggle />
    </div>
  );
}
