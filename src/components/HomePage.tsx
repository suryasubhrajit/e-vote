"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, ShieldCheck, Globe, Lock, CheckCircle2, Timer, Fingerprint, Vote, Landmark, MapPin } from "lucide-react";
import Link from "next/link";
import { useAuthMiddleware } from "@/app/auth/middleware/useAuthMiddleware";
import { getElectionStats, getLiveResults } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Search, Filter, Trophy, TrendingUp, User as UserIcon } from "lucide-react";
import Meteors from "@/components/magicui/meteors";
import RetroGrid from "@/components/magicui/retro-grid";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 14); // Set to 14 days from today for simulation
    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
        secs: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 md:gap-8 justify-center py-6">
      {[
        { label: "DAYS", value: timeLeft.days },
        { label: "HOURS", value: timeLeft.hours },
        { label: "MINS", value: timeLeft.mins },
        { label: "SECS", value: timeLeft.secs },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="bg-gradient-to-b from-[#FF9933] to-[#e8851a] text-white w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl shadow-xl text-2xl md:text-3xl font-black border border-[#FF9933]/50">
            {String(item.value).padStart(2, "0")}
          </div>
          <span className="mt-2 text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Spinning Ashoka Chakra SVG
const AshokaChakra = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} animate-spin`} style={{ animationDuration: "20s" }}>
    <circle cx="50" cy="50" r="45" fill="none" stroke="#000080" strokeWidth="3" />
    <circle cx="50" cy="50" r="8" fill="#000080" />
    {[...Array(24)].map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="50"
        x2={50 + 42 * Math.cos((i * 15 * Math.PI) / 180)}
        y2={50 + 42 * Math.sin((i * 15 * Math.PI) / 180)}
        stroke="#000080"
        strokeWidth="1.5"
      />
    ))}
  </svg>
);

export default function HomePage() {
  const { user } = useAuthMiddleware();
  const [stats, setStats] = useState<{
    totalVotes: number;
    totalCandidates: number;
    voterTurnout: number;
  } | null>(null);
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "MP" | "MLA">("ALL");
  const [stateFilter, setStateFilter] = useState("ALL");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [statsData, resultsData] = await Promise.all([
          getElectionStats(),
          getLiveResults()
        ]);
        setStats(statsData);
        setLiveResults(resultsData.slice(0, 5)); // Show top 5
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchAllData();
    const interval = setInterval(fetchAllData, 10000); // Auto refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const filteredResults = liveResults.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         candidate.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || candidate.type === typeFilter;
    const matchesState = stateFilter === "ALL" || candidate.state === stateFilter;
    return matchesSearch && matchesType && matchesState;
  });

  const uniqueStates = Array.from(new Set(liveResults.map(c => c.state))).sort();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <Meteors number={15} />
        <RetroGrid />
      </div>

      {/* Tricolor Top Bar */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white dark:bg-slate-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <main className="mx-auto container px-4 md:px-8 pt-12 pb-24">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center py-12 md:py-24 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <AshokaChakra className="w-8 h-8" />
              <Badge variant="outline" className="border-[#000080] dark:border-[#FF9933] text-[#000080] dark:text-[#FF9933] px-4 py-1.5 text-xs font-black uppercase tracking-widest">
                18th Lok Sabha General Election 2029
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Mera Vote, <span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] bg-clip-text text-transparent">Mera Adhikaar.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Exercise your fundamental democratic right under Article 326 of the Indian Constitution.
              Choose your local representative through a secure, Aadhaar-verified digital ballot
              administered by the Election Commission of Bharat (ECB).
            </p>
            <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-[10px] font-bold text-red-600 dark:text-red-400 leading-tight">
                ⚠️ LEGAL NOTICE: This website is a DUMMY PROJECT and is NOT an official government portal.
                Any similarity to actual persons, living or dead, or real-world political entities is purely coincidental.
                NO REAL DATA is used or stored for illegal purposes.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/vote">
                <Button size="lg" className="px-10 h-14 text-lg font-black gap-3 shadow-lg bg-gradient-to-r from-[#FF9933] to-[#e8851a] text-white hover:from-[#e8851a] hover:to-[#d4780f] border-none">
                  <Vote className="w-5 h-5" /> Cast Your Vote <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              {!user && (
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="px-10 h-14 text-lg font-black border-2 border-[#138808] text-[#138808] hover:bg-[#138808] hover:text-white dark:border-[#4CAF50] dark:text-[#4CAF50] dark:hover:bg-[#4CAF50] dark:hover:text-white">
                    <Fingerprint className="w-5 h-5 mr-2" /> Verify with Aadhaar
                  </Button>
                </Link>
              )}
            </div>
            <p className="text-xs text-slate-400 italic mt-2">
              * This is a simulation. Not affiliated with the actual Election Commission of India.
            </p>
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                <Timer className="w-4 h-4 text-[#FF9933]" /> Polling Deadline
              </h3>
              <p className="text-center text-xs text-slate-400 mb-4">Phase VII — Final Phase Voting</p>
              <CountdownTimer />
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white animate-in fade-in zoom-in duration-500">
                    {stats?.totalVotes || "0"}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Total Votes</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalCandidates || "0"}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Candidates</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#138808]">{stats?.voterTurnout?.toFixed(1) || "0.0"}%</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Turnout</div>
                </div>
              </div>
            </div>
            {/* Decorative tricolor glow */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#FF9933]/15 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#138808]/15 rounded-full blur-3xl -z-10" />
          </div>
        </section>
        {/* Live Results Section */}
        {liveResults.length > 0 && (
          <section className="py-12 md:py-24 border-b border-slate-200 dark:border-slate-800" id="results">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                  <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em]">LIVE COUNTING TERMINAL</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  Real-Time <span className="text-[#FF9933]">Leaderboard</span>
                </h2>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["ALL", "MP", "MLA"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t as any)}
                      className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${
                        typeFilter === t 
                        ? "bg-[#FF9933] text-white shadow-lg scale-105" 
                        : "bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {t === "ALL" ? "GLOBAL VIEW" : `${t} RESULTS`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                <div className="relative group flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF9933] transition-colors" />
                  <Input 
                    placeholder="Search Candidate / Party..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl font-bold focus:ring-[#FF9933]"
                  />
                </div>
                <select 
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="h-12 px-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#FF9933] text-slate-700 dark:text-slate-300 min-w-[160px]"
                >
                  <option value="ALL">All States</option>
                  {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResults.length > 0 ? (
                filteredResults.map((candidate, idx) => {
                  const isLeading = idx === 0 && searchTerm === "" && typeFilter === "ALL" && stateFilter === "ALL";
                  const voteShare = stats ? ((candidate.votes / stats.totalVotes) * 100).toFixed(1) : "0";
                  
                  return (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                      {/* Top Banner */}
                      <div className={`h-2 w-full ${candidate.type === "MP" ? "bg-[#FF9933]" : "bg-[#138808]"}`} />
                      
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-md">
                              {candidate.photo ? (
                                <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                  <UserIcon className="w-8 h-8 text-slate-300" />
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-slate-900 rounded-lg p-1 shadow-md border border-slate-100 dark:border-slate-800">
                              {candidate.symbol ? (
                                <img src={candidate.symbol} alt={candidate.party} className="w-full h-full object-contain" />
                              ) : (
                                <div className="text-[8px] font-black flex items-center justify-center h-full">IND</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-2 text-[8px] font-black tracking-widest border-slate-200 dark:border-slate-800 text-slate-500">
                              {candidate.type} • {candidate.state}
                            </Badge>
                            <div className="flex items-center justify-end gap-2 text-3xl font-black text-slate-900 dark:text-white">
                              {candidate.votes.toLocaleString()}
                              <TrendingUp className="w-4 h-4 text-[#138808] animate-bounce" />
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Validated Votes</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <h4 className="text-xl font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">
                            {candidate.name}
                          </h4>
                          <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            {candidate.party}
                          </p>
                          <p className="text-[10px] text-[#FF9933] font-black uppercase tracking-widest">
                            {candidate.constituency} Constituency
                          </p>
                        </div>

                        <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Vote Share</span>
                            <span className="text-sm font-black text-[#138808]">{voteShare}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                            <div 
                              className="h-full bg-gradient-to-r from-[#FF9933] to-[#e8851a] rounded-full transition-all duration-1000 shadow-sm"
                              style={{ width: `${voteShare}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Result Status Overlay */}
                      <div className={`py-3 px-8 flex items-center justify-center gap-2 ${idx === 0 ? "bg-[#138808]/10 text-[#138808]" : "bg-slate-50 dark:bg-slate-800/50 text-slate-500"}`}>
                        {idx === 0 ? <Trophy className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                          {idx === 0 ? "LEADING IN TRENDS" : "TRAILING"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No matching trends found</h3>
                  <p className="text-slate-500 text-sm">Try adjusting your filters or search keywords.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* How Indian Voting Works Section */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">How Digital Voting Works</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: <Fingerprint className="w-7 h-7 text-[#FF9933]" />, title: "Aadhaar & Voter ID Verification", desc: "Your identity is verified against UIDAI and EPIC databases using OTP authentication." },
              { step: "02", icon: <MapPin className="w-7 h-7 text-[#000080]" />, title: "Constituency Assignment", desc: "You are assigned your Lok Sabha constituency based on your registered address in the electoral roll." },
              { step: "03", icon: <Vote className="w-7 h-7 text-[#138808]" />, title: "Digital EVM Ballot", desc: "Cast your vote on a simulated Electronic Voting Machine showing candidate name, party, and election symbol." },
              { step: "04", icon: <CheckCircle2 className="w-7 h-7 text-purple-600" />, title: "VVPAT Confirmation", desc: "A digital VVPAT slip confirms your vote before it is recorded in the encrypted tally." },
            ].map((item, i) => (
              <div key={i} className="relative p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow group">
                <div className="text-6xl font-black text-slate-100 dark:text-slate-800 absolute top-4 right-4 select-none">{item.step}</div>
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Pillars */}
        <section className="py-24 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">ECI Security Pillars</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="w-8 h-8 text-[#FF9933]" />,
                title: "Aadhaar-Grade Encryption",
                desc: "Your vote is sealed with AES-256 encryption, the same standard used by UIDAI for Aadhaar biometric data protection."
              },
              {
                icon: <CheckCircle2 className="w-8 h-8 text-[#138808]" />,
                title: "VVPAT Verification",
                desc: "Voter-Verifiable Paper Audit Trail simulation ensures you can confirm your vote before final submission."
              },
              {
                icon: <Landmark className="w-8 h-8 text-[#000080]" />,
                title: "ECB Compliance",
                desc: "Adheres to the project-specific Representation of the People guidelines and project code of conduct."
              }
            ].map((pillar, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow group">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{pillar.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Who is eligible to vote?", a: "Every citizen aged 18 or above, registered in the electoral roll with a valid project ID, is eligible to vote in this simulation." },
                { q: "How is my identity verified?", a: "Your Aadhaar number and Voter ID are cross-verified against a dummy project database. An OTP is sent to your registered mobile number for simulation." },
                { q: "What is NOTA?", a: "NOTA (None of the Above) is an option available to voters who do not wish to vote for any of the listed candidates." },
                { q: "Can I change my vote after casting?", a: "No. As per ECB project guidelines, once a vote is recorded, it is final and cannot be altered or retracted. This mirrors real-world EVM behavior." },
                { q: "How are results counted?", a: "Votes are tallied constituency-wise. The candidate with the highest votes in each constituency wins the seat in this simulation." },
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex gap-3 items-center">
                    <span className="text-[#FF9933]">Q:</span> {faq.q}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 pl-7 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Tricolor Bar */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white dark:bg-slate-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </div>
  );
}
