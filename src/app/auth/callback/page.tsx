"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Loader from "@/components/Loader";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error during auth callback:", error.message);
      }
      router.push("/");
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader loading={true} />
    </div>
  );
}
