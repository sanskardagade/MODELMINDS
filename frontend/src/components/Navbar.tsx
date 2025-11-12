"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Projects", path: "/projects" },
    { name: "Services", path: "/services" },
    { name: "Insights", path: "/insights" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#848884] text-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="ModelMinds Logo"
              className="h-10 w-20 object-contain"
            />
            <span className="text-white text-2xl font-bold tracking-tight flex items-center">
              ModelMinds
              <span className="text-[#f97316] text-5xl leading-none">.</span>
            </span>
          </Link>



        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg border border-white font-medium transition-all duration-300
                  ${
                    isActive
                      ? "bg-orange-500 text-white border-orange-500"
                      : "text-white hover:bg-orange-500 hover:text-white hover:border-orange-500"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-3 bg-black px-6 pb-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-center px-4 py-2 rounded-lg border border-white font-medium transition-all duration-300
                  ${
                    isActive
                      ? "bg-orange-500 text-white border-orange-500"
                      : "text-white hover:bg-orange-500 hover:text-white hover:border-orange-500"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
