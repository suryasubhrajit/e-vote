"use client";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsList } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ModeToggle } from "./ThemeToggle";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthMiddleware } from "@/app/auth/middleware/useAuthMiddleware";
import { Button } from "./ui/button";
import { Landmark, ShieldCheck, Fingerprint, Globe, Users, Vote } from "lucide-react";
import Meteors from "@/components/magicui/meteors";


export default function Navbar() {
  const { user, isAdmin, isVoterVerified, profileName } = useAuthMiddleware();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [voterDetails, setVoterDetails] = useState<any>(null);

  useEffect(() => {
    const fetchVoterDetails = async () => {
      if (user && isVoterVerified) {
        const { data, error } = await supabase
          .from('voters')
          .select('*')
          .eq('linked_profile_id', user.id)
          .single();
        
        if (data) setVoterDetails(data);
      }
    };
    fetchVoterDetails();
  }, [user, isVoterVerified]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="sticky top-0 z-[100] w-full">
        {/* Global Disclaimer Bar */}
        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 text-[10px] py-2 px-4 text-center font-bold border-b border-amber-200 dark:border-amber-800">
          ⚠️ PROJECT ONLY: This is a simulated E-Voting system for educational purposes. Not affiliated with ECB, ECI, or any government body.
        </div>

        {/* Tricolor top band */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        {/* Main Header */}
        <header className="bg-[#1a1a2e] text-white shadow-xl border-b border-white/5">
          <div className="mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center py-4">
            <h1 className="font-bold text-xl tracking-tight flex items-center gap-2">
              <Link href={"/"} className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden p-1 shrink-0">
                  <Image src="https://iili.io/BZEErOb.png" alt="ECB Logo" width={32} height={32} className="object-contain" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] md:text-base font-black tracking-wide leading-tight truncate uppercase">Bharat Election Project</span>
                  <span className="text-[8px] md:text-[10px] font-medium text-slate-400 tracking-widest uppercase truncate">Election Commission of Bharat</span>
                </div>
              </Link>
            </h1>

          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              <li>
                <Link href={"/"} className={`text-sm font-semibold hover:text-[#FF9933] transition-all uppercase tracking-widest relative py-1 ${pathname === "/" ? "text-[#FF9933] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FF9933]" : "text-white"}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href={"/about"} className={`text-sm font-semibold hover:text-[#FF9933] transition-all uppercase tracking-widest relative py-1 ${pathname === "/about" ? "text-[#FF9933] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FF9933]" : "text-white"}`}>
                  About
                </Link>
              </li>
              <li>
                <Link href={"/candidates"} className={`text-sm font-semibold hover:text-[#FF9933] transition-all uppercase tracking-widest relative py-1 ${pathname === "/candidates" ? "text-[#FF9933] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FF9933]" : "text-white"}`}>
                  Candidates
                </Link>
              </li>
              <li>
                <Link href={"/vote"} className={`text-sm font-semibold hover:text-[#FF9933] transition-all uppercase tracking-widest relative py-1 ${pathname === "/vote" ? "text-[#FF9933] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#FF9933]" : "text-white"}`}>
                  Vote
                </Link>
              </li>
              <li className="h-6 w-px bg-slate-700 mx-2" />
              <li>
                {user ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="flex items-center gap-3 hover:bg-white/10 px-3 py-1 rounded-full transition-all cursor-pointer">
                        <Avatar className="w-8 h-8 border border-[#FF9933]/40">
                          <AvatarImage
                            src={user.user_metadata?.avatar_url}
                            alt={user.user_metadata?.full_name || "@user"}
                          />
                          <AvatarFallback className="bg-[#FF9933] text-white text-xs font-bold">
                            {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium hidden lg:inline">{profileName || user.user_metadata?.full_name || user.email}</span>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-[#0f172a] text-white border-slate-800 shadow-2xl p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <div className="sticky top-0 z-10">
                        <div className="w-full h-1 flex">
                          <div className="flex-1 bg-[#FF9933]" />
                          <div className="flex-1 bg-white" />
                          <div className="flex-1 bg-[#138808]" />
                        </div>
                        <DialogHeader className="bg-[#0f172a]/95 backdrop-blur-md p-4 md:p-6 pb-4 border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
                              <Image src="https://iili.io/BZEErOb.png" alt="ECB Logo" fill className="object-contain" />
                            </div>
                            <div className="bg-gradient-to-br from-[#FF9933] to-[#e8851a] rounded-xl flex items-center justify-center shadow-lg shrink-0 w-8 h-8 md:w-10 md:h-10">
                              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div className="min-w-0 text-left">
                              <DialogTitle className="text-base md:text-xl font-black tracking-tight uppercase truncate">Voter Digital Passport</DialogTitle>
                              <DialogDescription className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-0.5 truncate">
                                Government of Bharat • Official Identity Terminal
                              </DialogDescription>
                            </div>
                          </div>
                        </DialogHeader>
                      </div>
                      
                      <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                          {/* Profile Section (Left) */}
                          <div className="md:col-span-2 flex flex-col items-center justify-center space-y-4 bg-slate-900/40 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF9933]/5 to-[#138808]/5 opacity-50" />
                            <Avatar className="w-32 h-32 border-4 border-slate-800 shadow-2xl relative z-10">
                              <AvatarImage src={user.user_metadata?.avatar_url} />
                              <AvatarFallback className="text-4xl bg-gradient-to-br from-slate-700 to-slate-900 text-white font-black">
                                {user.user_metadata?.full_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-center relative z-10">
                              <h3 className="text-2xl font-black text-white leading-tight">{profileName || user.user_metadata?.full_name}</h3>
                              <Badge className={`mt-3 px-4 py-1 text-[10px] font-black tracking-[0.2em] border-none shadow-lg ${isVoterVerified ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>
                                {isVoterVerified ? "AUTHORIZED" : "PENDING"}
                              </Badge>
                            </div>
                          </div>

                          {/* Details Section (Right) */}
                          <div className="md:col-span-3 space-y-4">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                              <div className="h-px flex-1 bg-slate-800" />
                              Citizen Data
                              <div className="h-px w-4 bg-slate-800" />
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                              {[
                                { label: "EPIC Number", value: voterDetails?.voter_id_epic, isHighlight: true, icon: Fingerprint },
                                { label: "State / UT", value: voterDetails?.state, icon: Landmark },
                                { label: "MP constituency", value: voterDetails?.constituency_mp, icon: ShieldCheck },
                                { label: "MLA constituency", value: voterDetails?.constituency_mla, icon: ShieldCheck },
                              ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5 group hover:bg-slate-800/60 transition-all">
                                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                    <item.icon className={`w-5 h-5 ${item.isHighlight ? "text-[#FF9933]" : "text-slate-400"}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
                                    <p className={`text-base font-bold truncate ${item.isHighlight ? "text-[#FF9933] font-mono tracking-wider" : "text-white"}`}>
                                      {item.value || "NOT AVAILABLE"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="p-8 pt-0 flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-3 w-full">
                          <Button asChild variant="outline" className="flex-1 h-12 border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-widest transition-all">
                            <Link href="/vote">EVM Status</Link>
                          </Button>
                          <Button asChild variant="outline" className="flex-1 h-12 border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-widest transition-all">
                            <Link href="/about">Help Center</Link>
                          </Button>
                          {isAdmin && (
                            <Button asChild className="flex-1 h-12 bg-white text-slate-900 hover:bg-slate-200 font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                              <Link href="/dashboard">Admin Panel</Link>
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-center gap-2 pt-6 border-t border-white/5">
                          <div className="flex items-center gap-3 opacity-20">
                            <div className="h-px w-16 bg-white" />
                            <Fingerprint className="w-6 h-6" />
                            <div className="h-px w-16 bg-white" />
                          </div>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
                            Authenticated Secure Terminal
                          </p>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Link href={"/auth/login"}>
                    <Button variant="outline" className="bg-transparent border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white font-bold px-6">
                      Sign In
                    </Button>
                  </Link>
                )}
              </li>
              <li>
                <ModeToggle />
              </li>
            </ul>
          </nav>

          <div className="md:hidden">
            <button onClick={toggleSidebar} className="text-2xl">
              {isOpen ? <AiOutlineClose /> : <BsList />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Sidebar */}
        <div className={`fixed inset-0 bg-[#0f172a] z-[100] transition-all duration-500 ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden flex flex-col`}>
          {/* Header Area */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 shrink-0">
                <Image src="https://iili.io/BZEErOb.png" alt="ECB Logo" fill className="object-contain" />
              </div>
              <span className="text-xs font-black tracking-[0.2em] uppercase text-white/90">ECB Digital Portal</span>
            </div>
            <button onClick={toggleSidebar} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <AiOutlineClose className="text-lg" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-8 overflow-y-auto">
            <ul className="flex flex-col gap-2.5">
              {[
                { name: "Home", href: "/", icon: <Globe className="w-4 h-4" /> },
                { name: "About", href: "/about", icon: <Landmark className="w-4 h-4" /> },
                { name: "Candidates", href: "/candidates", icon: <Users className="w-4 h-4" /> },
                { name: "Vote", href: "/vote", icon: <Vote className="w-4 h-4" /> },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    onClick={toggleSidebar} 
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all font-bold uppercase tracking-widest text-[11px] ${
                      pathname === item.href 
                      ? "bg-[#FF9933] text-white shadow-lg scale-[0.98]" 
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <span className={pathname === item.href ? "text-white" : "text-[#FF9933]"}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Area */}
          <div className="p-6 border-t border-white/5 bg-slate-900/50">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9933] to-[#e8851a] flex items-center justify-center font-black text-white text-xs shadow-lg">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Active Session</p>
                    <p className="text-[11px] font-bold text-white truncate opacity-90">{user.email}</p>
                  </div>
                </div>
                {!isVoterVerified ? (
                  <Button onClick={handleLogout} variant="destructive" className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg">
                    Sign Out Terminal
                  </Button>
                ) : (
                  <Button disabled variant="outline" className="w-full h-12 rounded-xl border-slate-800 text-slate-600 font-black uppercase tracking-widest text-[10px] opacity-40">
                    Sign Out Locked
                  </Button>
                )
              }
              </div>
            ) : (
              <Link href="/auth/login" onClick={toggleSidebar}>
                <Button className="w-full h-12 bg-[#FF9933] hover:bg-[#e8851a] text-white font-black uppercase tracking-widest rounded-xl text-[10px] shadow-lg">
                  Sign In to Verify
                </Button>
              </Link>
            )}
            <p className="text-center text-[7px] text-slate-700 font-bold uppercase tracking-[0.4em] mt-5">
              Secure ECB Digital Terminal • v1.0.4
            </p>
          </div>
        </div>
    </>
  );
}
