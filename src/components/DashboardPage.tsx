"use client";

import { useEffect, useState } from "react";
import { VotingStatusPieChart, CandidateVotesPieChart } from "./PieChart";
import { supabase } from "@/lib/supabase";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";


export function DashboardPage() {
  const [mpVotingData, setMpVotingData] = useState({ voted: 0, notVoted: 0 });
  const [mlaVotingData, setMlaVotingData] = useState({ voted: 0, notVoted: 0 });
  const [mpCandidateData, setMpCandidateData] = useState<{ name: string; votes: number }[]>([]);
  const [mlaCandidateData, setMlaCandidateData] = useState<{ name: string; votes: number }[]>([]);

  useEffect(() => {
    const fetchVotingData = async () => {
      const [profilesResponse, candidatesResponse, votesResponse] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('candidates').select('id, name, type'),
        supabase.from('votes').select('vote_type, candidate_id')
      ]);

      if (profilesResponse.error || candidatesResponse.error || votesResponse.error) {
        console.error("Error fetching dashboard data");
        return;
      }

      const totalProfiles = profilesResponse.count || 0;
      const candidates = candidatesResponse.data;
      const votes = votesResponse.data;

      const candidateMap: Record<string, { name: string; type: string }> = {};
      candidates.forEach(c => candidateMap[c.id] = { name: c.name, type: c.type });

      let votedMP = 0;
      let votedMLA = 0;
      const mpVotes: Record<string, number> = {};
      const mlaVotes: Record<string, number> = {};

      votes.forEach(v => {
        const candidate = candidateMap[v.candidate_id];
        if (v.vote_type === 'MP') {
          votedMP++;
          if (candidate) mpVotes[candidate.name] = (mpVotes[candidate.name] || 0) + 1;
        } else {
          votedMLA++;
          if (candidate) mlaVotes[candidate.name] = (mlaVotes[candidate.name] || 0) + 1;
        }
      });

      setMpVotingData({ voted: votedMP, notVoted: Math.max(0, totalProfiles - votedMP) });
      setMlaVotingData({ voted: votedMLA, notVoted: Math.max(0, totalProfiles - votedMLA) });
      setMpCandidateData(Object.entries(mpVotes).map(([name, votes]) => ({ name, votes })));
      setMlaCandidateData(Object.entries(mlaVotes).map(([name, votes]) => ({ name, votes })));
    };

    fetchVotingData();
  }, []);


  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tight mb-4">Lok Sabha (MP) Turnout</h3>
          <VotingStatusPieChart votingData={mpVotingData} />
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tight mb-4">State Assembly (MLA) Turnout</h3>
          <VotingStatusPieChart votingData={mlaVotingData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tight mb-4">MP Candidate Standings</h3>
          <CandidateVotesPieChart candidateData={mpCandidateData} />
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tight mb-4">MLA Candidate Standings</h3>
          <CandidateVotesPieChart candidateData={mlaCandidateData} />
        </div>
      </div>
    </>
  );
}
