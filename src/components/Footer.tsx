import Link from "next/link";
import { Landmark, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-slate-400 py-12 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF9933] to-[#e8851a] rounded-lg flex items-center justify-center">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-black uppercase tracking-widest text-sm">Bharat Election Project</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">© 2029 Election Commission of Bharat (ECB) — Non-Governmental Simulation</div>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <Link href="/about" className="hover:text-[#FF9933] transition-colors">ECB Guidelines</Link>
            <Link href="/about" className="hover:text-[#FF9933] transition-colors">Project Info</Link>
            <Link href="/about" className="hover:text-[#FF9933] transition-colors">Help Desk</Link>
          </div>
          <p className="text-[9px] text-slate-600 max-w-xs text-center md:text-right leading-tight italic">
            This is a mock project for academic and educational purposes. It does not process real ballots or influence real-world elections.
          </p>
        </div>
      </div>
      {/* Bottom tricolor */}
      <div className="h-1 w-full flex mt-12">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white/80" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </footer>
  );
}
