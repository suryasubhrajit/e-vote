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
import { Landmark, ShieldCheck, Fingerprint } from "lucide-react";
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
      {/* Global Disclaimer Bar */}
      <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 text-[10px] py-1.5 px-4 text-center font-bold border-b border-amber-200 dark:border-amber-800 sticky top-0 z-[70]">
        ⚠️ PROJECT ONLY: This is a simulated E-Voting system for educational purposes. Not affiliated with ECB, ECI, or any government body.
      </div>

      {/* Tricolor top band */}
      <div className="h-1 w-full flex z-[60] sticky top-[28px]">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <header className="z-50 sticky top-[32px] bg-[#1a1a2e] text-white shadow-lg">
        <div className="mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center py-3">
          <h1 className="font-bold text-xl tracking-tight flex items-center gap-2">
            <Link href={"/"} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden p-1">
                <Image src="https://iili.io/BZECcMl.png" alt="ECB Logo" width={32} height={32} className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-wide leading-tight">Bharat Election Project</span>
                <span className="text-[9px] font-medium text-slate-400 tracking-widest uppercase">Election Commission of Bharat (ECB)</span>
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
                        <DialogHeader className="bg-[#0f172a]/95 backdrop-blur-md p-6 pb-4 border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <Image src="https://iili.io/BZECcMl.png" alt="ECB Logo" width={48} height={48} className="object-contain" />
                            <div className="bg-gradient-to-br from-[#FF9933] to-[#e8851a] rounded-xl flex items-center justify-center shadow-lg shrink-0">
                              <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <DialogTitle className="text-xl font-black tracking-tight uppercase">Voter Digital Passport</DialogTitle>
                              <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
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
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 bg-[#1a1a2e]/98 z-[60] transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"} md:hidden`}>
          <div className="flex justify-end p-8">
            <button onClick={toggleSidebar} className="text-white text-3xl">
              <AiOutlineClose />
            </button>
          </div>
          <ul className="flex flex-col items-center gap-12 text-white mt-12">
            <li><Link href="/" onClick={toggleSidebar} className={`text-2xl font-bold transition-all ${pathname === "/" ? "text-[#FF9933] scale-110" : "text-white hover:text-[#FF9933]"}`}>Home</Link></li>
            <li><Link href="/about" onClick={toggleSidebar} className={`text-2xl font-bold transition-all ${pathname === "/about" ? "text-[#FF9933] scale-110" : "text-white hover:text-[#FF9933]"}`}>About</Link></li>
            <li><Link href="/candidates" onClick={toggleSidebar} className={`text-2xl font-bold transition-all ${pathname === "/candidates" ? "text-[#FF9933] scale-110" : "text-white hover:text-[#FF9933]"}`}>Candidates</Link></li>
            <li><Link href="/vote" onClick={toggleSidebar} className={`text-2xl font-bold transition-all ${pathname === "/vote" ? "text-[#FF9933] scale-110" : "text-white hover:text-[#FF9933]"}`}>Vote</Link></li>
            <li>
              {user ? (
                !isVoterVerified ? (
                  <Button onClick={handleLogout} variant="destructive" size="lg">Sign Out</Button>
                ) : (
                  <Button disabled variant="outline" size="lg" className="border-slate-500 text-slate-500">Sign Out Locked</Button>
                )
              ) : (
                <Link href="/auth/login" onClick={toggleSidebar}>
                  <Button size="lg" className="bg-[#FF9933] hover:bg-[#e8851a] text-white">Sign In</Button>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
