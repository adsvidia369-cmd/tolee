import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Tolee - The Group Social Network",
  description: "Every post belongs to a Tolee. Join communities and share moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="antialiased min-h-screen bg-background flex flex-col">
        {/* Global Top Navbar */}
        <Header />
        
        <div className="flex flex-1 w-full relative">
          {/* Global Sidebar - hidden on small screens, fixed on left for large */}
          <Sidebar />
          
          {/* Main Content Area - padded left on large screens to accommodate fixed sidebar */}
          <div className="flex-grow w-full lg:pl-64">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
