"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RetroGrid from "@/components/magicui/retro-grid";
import { useAuthMiddleware } from "@/app/auth/middleware/useAuthMiddleware";
import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";
import { Landmark, ShieldCheck, Fingerprint } from "lucide-react";
import Meteors from "@/components/magicui/meteors";


export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, loading } = useAuthMiddleware();

  if (loading) {
    return <Loader loading={loading} />;
  }

  if (user) {
    return null;
  }

  const [deviceWarning, setDeviceWarning] = useState<string | null>(null);

  useState(() => {
    // Simulate "1 device multiple login not support"
    const activeVoter = localStorage.getItem("active_voter_session");
    if (activeVoter) {
      // In a real app, we'd check if this session is still valid
      setDeviceWarning(`Another voter session (${activeVoter}) is currently active on this device. Multiple logins are not supported for security reasons.`);
    }
  });

  const handleGoogleLogin = async () => {
    if (deviceWarning) {
      toast.error("Security Lock: Please clear browser data or use a different device.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      // For demo: set a marker in local storage
      localStorage.setItem("active_voter_session", "session_" + Math.random().toString(36).substr(2, 5));
    } catch (error: any) {
      console.error("Error logging in with Google:", error);
      toast.error(error.message || "Login failed!");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Loader loading={isLoading} />
      <div className="flex justify-center items-center w-full h-[100vh] relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Meteors number={15} />
        </div>
        <RetroGrid />
        
        {/* Tricolor top line on card */}
        <Card className="w-full max-w-md overflow-hidden">
          <div className="h-1.5 w-full flex">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white dark:bg-slate-300" />
            <div className="flex-1 bg-[#138808]" />
          </div>
          
          <CardHeader className="text-center pt-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#FF9933] to-[#e8851a] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Landmark className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-black">Voter Authentication</CardTitle>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
              Bharat Election Project • ECB Digital Terminal
            </p>
            <CardDescription>
              <p className="mt-6 mb-2 text-sm">
                Sign in with your Google account to access the digital voting portal. 
                Your identity will be linked to your Aadhaar & Voter ID for verification.
              </p>

              {deviceWarning ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-left mb-6 border border-red-200 dark:border-red-800">
                  <ShieldCheck className="w-6 h-6 text-red-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-tight">Device Security Lock</p>
                    <p className="text-[10px] text-red-700 dark:text-red-300 leading-tight mt-1">{deviceWarning}</p>
                    <button 
                      onClick={() => { localStorage.removeItem("active_voter_session"); setDeviceWarning(null); }}
                      className="text-[9px] font-bold text-red-600 underline mt-2 uppercase"
                    >
                      Reset Device (Authorized Personnel Only)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-left mb-6 mt-4">
                  <Fingerprint className="w-5 h-5 text-[#FF9933] shrink-0" />
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                    After sign-in, you will complete Aadhaar + Voter ID (EPIC) verification before accessing the EVM ballot.
                  </p>
                </div>
              )}
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-6 border-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <FcGoogle size={24} />
                <span className="font-semibold text-base">Sign in with Google</span>
              </Button>

              <div className="mt-6 flex items-center gap-2 justify-center text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Secured by Election Commission of India guidelines (Simulated)</span>
              </div>
              
              <p className="mt-4 text-[10px] text-slate-400 italic">
                By signing in, you agree to participate in the democratic process and maintain the secrecy of your ballot as per the Representation of the People Act, 1951.
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
