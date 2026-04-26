"use client";
import Link from "next/link";
import { Home, LineChart, Menu, User, Users, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <>
      {/* Tricolor top bar */}
      <div className="h-1 w-full flex fixed top-0 z-[70]">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      <div className="left-0 -z-30 fixed flex flex-col justify-center items-center w-full h-[100vh] overflow-hidden">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)] opacity-50"
          )}
        />
      </div>
      <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] w-full min-h-screen">
        <div className="md:block hidden bg-muted/40 border-r border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-2 h-full max-h-screen">
            <div className="flex items-center px-4 lg:px-6 border-b h-14 lg:h-[60px] bg-[#1a1a2e]">
              <Link href="/" className="flex items-center gap-3 font-bold">
                <div className="w-7 h-7 bg-gradient-to-br from-[#FF9933] to-[#e8851a] rounded-md flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xs uppercase tracking-widest font-black">ECI Admin Panel</span>
                  <span className="text-slate-500 text-[8px] uppercase tracking-widest">भारत निर्वाचन आयोग</span>
                </div>
              </Link>
            </div>
            <div className="flex-1 mt-4">
              <nav className="items-start grid px-2 lg:px-4 font-medium text-sm gap-2">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                    pathname === "/dashboard"
                      ? "bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20 font-bold"
                      : "text-muted-foreground hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Election Analytics
                </Link>
                <Link
                  href="/dashboard/candidates"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                    pathname.startsWith("/dashboard/candidates")
                      ? "bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20 font-bold"
                      : "text-muted-foreground hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Candidate Registry
                </Link>
                <Link
                  href="/dashboard/users"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                    pathname === "/dashboard/users"
                      ? "bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20 font-bold"
                      : "text-muted-foreground hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Electoral Roll
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 lg:px-6 border-b h-14 lg:h-[60px] sticky top-0 z-10">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden shrink-0"
                >
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col bg-[#1a1a2e] border-none">
                <nav className="gap-2 grid font-medium text-lg mt-8">
                  <Link
                    href="/"
                    className="flex items-center gap-3 pb-8 font-bold text-white border-b border-white/10"
                  >
                    <Landmark className="w-6 h-6 text-[#FF9933]" />
                    <span className="uppercase tracking-widest text-sm">Bharat Election</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-4 px-3 py-3 rounded-xl mt-4 transition-all ${
                      pathname === "/dashboard"
                        ? "text-white bg-white/10"
                        : "text-slate-400"
                    } hover:text-white`}
                  >
                    <Home className="w-5 h-5" />
                    Analytics
                  </Link>
                  <Link
                    href="/dashboard/candidates"
                    className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
                      pathname.startsWith("/dashboard/candidates")
                        ? "text-white bg-white/10"
                        : "text-slate-400"
                    } hover:text-white`}
                  >
                    <Users className="w-5 h-5" />
                    Candidates
                  </Link>
                  <Link
                    href="/dashboard/users"
                    className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
                      pathname.startsWith("/dashboard/users")
                        ? "text-white bg-white/10"
                        : "text-slate-400"
                    } hover:text-white`}
                  >
                    <User className="w-5 h-5" />
                    Voters
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex-1">
               <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 hidden md:block">
                  {pathname.split("/").filter(Boolean).join(" / ")}
               </h2>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </header>
          <main className="flex flex-col flex-1 gap-4 lg:gap-6 p-4 lg:p-10 bg-slate-50 dark:bg-slate-950/50">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
