import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/Navbar";

export const metadata: Metadata = {
  title: "TactileGen — Make Every Diagram Touchable",
  description: "TactileGen transforms complex educational diagrams into simplified tactile-ready representations using computer vision and semantic segmentation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scrollbar-thin">
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
