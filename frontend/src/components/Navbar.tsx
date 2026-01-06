"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Determine which link to show based on current path
  const getLeftLink = () => {
    if (pathname === "/services") {
      return (
        <Link
          href="/services"
          className="text-white font-medium underline"
        >
          Services
        </Link>
      );
    }
    if (pathname === "/insights") {
      return (
        <Link
          href="/insights"
          className="text-white font-medium underline"
        >
          Insights
        </Link>
      );
    }
    return (
      <Link
        href="/projects"
        className={`text-white font-medium ${
          pathname === "/projects" ? "underline" : ""
        }`}
      >
        Works
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-black text-white relative" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center relative">
        {/* Left: Hamburger Menu + Works/Services */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="hidden sm:inline">{getLeftLink()}</span>
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center gap-1 sm:gap-1.5 absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Stylized M Logo - compact */}
            <div className="relative w-2.5 h-2.5 sm:w-3 sm:h-3">
              {/* Left vertical bar (thicker) */}
              <div className="absolute left-0 top-0 w-[2px] h-full bg-white"></div>
              {/* Right vertical bar (thicker) */}
              <div className="absolute right-0 top-0 w-[2px] h-full bg-white"></div>
              {/* Center vertical bar (inner part of M, thinner, offset right) */}
              <div className="absolute left-[60%] top-0 w-[1px] h-3/4 bg-white"></div>
              {/* Top horizontal bar connecting outer bars */}
              <div className="absolute left-0 top-0 w-full h-[1px] bg-white"></div>
              {/* Bottom horizontal bar connecting outer bars */}
              <div className="absolute left-0 bottom-0 w-full h-[1px] bg-white"></div>
            </div>
            {/* Stacked text: Model on first line, Minds. on second line */}
            <div className="flex flex-col leading-none">
              <span className="text-white text-xs sm:text-sm font-normal tracking-tight">Model</span>
              <span className="text-white text-xs sm:text-sm font-normal tracking-tight">
                Minds<span className="text-red-500">.</span>
              </span>
            </div>
          </div>
        </Link>

        {/* Right: Contact Us Button */}
        <Link
          href="/contact"
          className="px-3 py-1.5 sm:px-6 sm:py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors duration-200 font-medium text-xs sm:text-base"
        >
          <span className="hidden sm:inline">Contact Us</span>
          <span className="sm:hidden">Contact</span>
        </Link>
      </div>

      {/* Dropdown Menu - visible on all screen sizes when hamburger is clicked */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black border-t border-gray-800 flex flex-col gap-3 px-6 pb-4 z-50">
          <Link
            href="/projects"
            className="text-white py-2 hover:text-gray-300 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Works
          </Link>
          <Link
            href="/services"
            className="text-white py-2 hover:text-gray-300 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/insights"
            className="text-white py-2 hover:text-gray-300 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Insights
          </Link>
        </div>
      )}
    </nav>
  );
}
