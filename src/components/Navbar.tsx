"use client";
import { useRouter } from "next/navigation";
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
import { ModeToggle } from "./ThemeToggle";
import Link from "next/link";
import { useState } from "react";
import { useAuthMiddleware } from "@/app/auth/middleware/useAuthMiddleware";
import { Button } from "./ui/button";
import { Landmark, ShieldCheck, Fingerprint } from "lucide-react";
import Meteors from "@/components/magicui/meteors";


export default function Navbar() {
  const { user, isAdmin, isVoterVerified } = useAuthMiddleware();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
              <div className="w-9 h-9 bg-gradient-to-br from-[#FF9933] to-[#e8851a] rounded-lg flex items-center justify-center shadow-md">
                <Landmark className="w-5 h-5 text-white" />
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
                <Link href={"/"} className="text-sm font-semibold hover:text-[#FF9933] transition-colors uppercase tracking-widest">
                  Home
                </Link>
              </li>
              <li>
                <Link href={"/about"} className="text-sm font-semibold hover:text-[#FF9933] transition-colors uppercase tracking-widest">
                  About
                </Link>
              </li>
              <li>
                <Link href={"/candidates"} className="text-sm font-semibold hover:text-[#FF9933] transition-colors uppercase tracking-widest">
                  Candidates
                </Link>
              </li>
              <li>
                <Link href={"/vote"} className="text-sm font-semibold hover:text-[#FF9933] transition-colors uppercase tracking-widest">
                  Vote
                </Link>
              </li>
              <li className="h-6 w-px bg-slate-700 mx-2" />
              <li>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <div className="flex items-center gap-3 hover:bg-white/10 px-3 py-1 rounded-full transition-all">
                        <Avatar className="w-8 h-8 border border-[#FF9933]/40">
                          <AvatarImage
                            src={user.user_metadata?.avatar_url}
                            alt={user.user_metadata?.full_name || "@user"}
                          />
                          <AvatarFallback className="bg-[#FF9933] text-white text-xs font-bold">
                            {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium hidden lg:inline">{user.user_metadata?.full_name || user.email}</span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                      <DropdownMenuLabel>Voter Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isAdmin && (
                        <DropdownMenuItem>
                          <Link href={"/dashboard"} className="w-full">Election Dashboard</Link>
                        </DropdownMenuItem>
                      )}
                      {!isVoterVerified ? (
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                          Sign Out
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem disabled className="text-slate-400">
                          Sign Out (Locked)
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
            <li><Link href="/" onClick={toggleSidebar} className="text-2xl font-bold hover:text-[#FF9933] transition-colors">Home</Link></li>
            <li><Link href="/about" onClick={toggleSidebar} className="text-2xl font-bold hover:text-[#FF9933] transition-colors">About</Link></li>
            <li><Link href="/candidates" onClick={toggleSidebar} className="text-2xl font-bold hover:text-[#FF9933] transition-colors">Candidates</Link></li>
            <li><Link href="/vote" onClick={toggleSidebar} className="text-2xl font-bold hover:text-[#FF9933] transition-colors">Vote</Link></li>
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
