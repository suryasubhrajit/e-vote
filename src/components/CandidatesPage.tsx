"use client";

import { useState, useEffect } from "react";
import { fetchCandidates } from "@/lib/utils";
import CandidateCard from "./CandidateCard";
import { Input } from "./ui/input";
import { Search, Users, Landmark, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "./ui/badge";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCandidates();
      // Filter out NOTA from the public directory - NOTA is only for the voting terminal
      const realCandidates = data.filter(c => c.name !== "Candidate NOTA" && c.partyName !== "NOTA");
      setCandidates(realCandidates);
      setFilteredCandidates(realCandidates);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    let result = candidates;

    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.constituency.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (stateFilter !== "all") {
      result = result.filter(c => c.state === stateFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter(c => c.type === typeFilter);
    }

    setFilteredCandidates(result);
  }, [searchQuery, stateFilter, typeFilter, candidates]);

  const uniqueStates = Array.from(new Set(candidates.map(c => c.state))).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Badge className="bg-[#FF9933] text-white px-3 py-1 text-[10px] font-black tracking-widest uppercase">
              ECB Digital Directory
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-4">
              <Landmark className="w-10 h-10 text-[#FF9933]" />
              Candidates List
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
              Explore the profile and manifesto of candidates contesting in the National Elections. 
              View their education, assets, and visions for their respective constituencies.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm self-center md:self-end">
            <Users className="w-5 h-5 text-[#138808]" />
            <span className="font-black text-xl text-slate-900 dark:text-white">{filteredCandidates.length}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Candidates Found</span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Candidates</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder="Search by name, party or constituency..." 
                  className="pl-12 h-14 rounded-2xl border-slate-200 focus:ring-[#FF9933] bg-slate-50/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter by State</label>
              <Select onValueChange={setStateFilter} defaultValue="all">
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Candidate Type</label>
              <Select onValueChange={setTypeFilter} defaultValue="all">
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="MP">Lok Sabha (MP)</SelectItem>
                  <SelectItem value="MLA">State Assembly (MLA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[500px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCandidates.map(candidate => (
              <CandidateCard 
                key={candidate.id} 
                {...candidate} 
                votingOption={false} 
              />
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">No candidates found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query.</p>
          </div>
        )}

        {/* ECB Project Footer */}
        <div className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
            Digital Candidate Directory v1.0 • Bharat Election Project (ECB)
          </p>
        </div>
      </div>
    </div>
  );
}
