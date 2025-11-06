import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";


export const metadata = {
  title: "ModelMinds",
  description: "AI-powered digital innovation studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-500 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
