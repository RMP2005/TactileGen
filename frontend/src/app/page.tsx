"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/workspace");
  }, [router]);

  return (
    <main className="min-h-screen bg-[#070706] flex items-center justify-center">
      <p className="text-zinc-500 text-sm tracking-widest">Redirecting to workspace...</p>
    </main>
  );
}