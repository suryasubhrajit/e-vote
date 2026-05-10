import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/lib/supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validatePAN = (pan: string) => {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return regex.test(pan);
};

export const validateAadhaar = (aadhaar: string) => {
  // Regex for 12 digits, no spaces for raw validation or allow spaces
  // Relaxed for simulated testing (any 12 digits)
  const regex = /^[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}$/;
  return regex.test(aadhaar);
};

/**
 * Validates a Voter ID (EPIC Number) in the standard format:
 * 3 uppercase letters (regional/series prefix) + 7 digits (unique sequence)
 * Example: ABC1234567
 */
export const validateVoterId = (voterId: string) => {
  const regex = /^[A-Z]{3}[0-9]{7}$/;
  return regex.test(voterId.trim().toUpperCase());
};

export const fetchCandidates = async () => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*');
    
  if (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }

  return data.map((candidate) => ({
    id: candidate.id,
    name: candidate.name || "No Name Provided",
    description: candidate.description || "No Description Provided",
    vision: candidate.vision || "No Vision Provided",
    mission: candidate.mission || "No Mission Provided",
    photoURL: candidate.photo_url,
    type: candidate.type,
    partyName: candidate.party_name || "Swadhin",
    partySymbolURL: candidate.party_symbol_url,
    state: candidate.state,
    constituency: candidate.constituency,
    biography: candidate.biography,
    education: candidate.education,
    assets: candidate.assets,
    liabilities: candidate.liabilities,
    criminal_records: candidate.criminal_records,
    district: candidate.district,
    gender: candidate.gender,
  }));
};

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, candidates!profiles_selected_candidate_fkey(name)');

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data.map((profile: any) => ({
    uid: profile.id,
    name: profile.name || "null",
    email: profile.email || "null",
    isAdmin: profile.is_admin || false,
    votedMP: profile.voted_mp,
    votedMLA: profile.voted_mla,
    state: profile.state,
    constituency: profile.constituency_mp,
  }));
};


export async function getElectionStats(): Promise<{
  totalVotes: number;
  totalCandidates: number;
  voterTurnout: number;
}> {
  try {
    // Get unique voters who have cast at least one vote
    const { data: uniqueVoters, error: votersError } = await supabase
      .from('votes')
      .select('voter_profile_id');
    
    const uniqueVoterIds = new Set(uniqueVoters?.map(v => v.voter_profile_id)).size;

    const [votesCount, candidatesRes, profilesRes] = await Promise.all([
      supabase.from('votes').select('*', { count: 'exact', head: true }),
      supabase.from('candidates').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true })
    ]);

    const totalVotes = votesCount.count ?? 0;
    const totalCandidates = candidatesRes.count ?? 0;
    const totalProfiles = profilesRes.count ?? 0;
    
    const voterTurnout = totalProfiles > 0 ? (uniqueVoterIds / totalProfiles) * 100 : 0;

    return {
      totalVotes,
      totalCandidates,
      voterTurnout,
    };
  } catch (error) {
    console.error("Error fetching election stats:", error);
    return { totalVotes: 0, totalCandidates: 0, voterTurnout: 0 };
  }
}

export async function getLiveResults() {
  try {
    // Fetch all votes and join with candidates
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select(`
        candidate_id,
        candidates (
          name,
          party_name,
          party_symbol_url,
          type,
          photo_url,
          state,
          constituency,
          gender
        )
      `);

    if (votesError) throw votesError;

    // Tally votes
    const tally: Record<string, any> = {};
    votes.forEach((v: any) => {
      const id = v.candidate_id;
      if (!tally[id]) {
        tally[id] = {
          id,
          name: v.candidates?.name,
          party: v.candidates?.party_name,
          symbol: v.candidates?.party_symbol_url,
          type: v.candidates?.type,
          photo: v.candidates?.photo_url,
          state: v.candidates?.state,
          constituency: v.candidates?.constituency,
          gender: v.candidates?.gender,
          votes: 0
        };
      }
      tally[id].votes++;
    });

    const candidates = Object.values(tally);

    // Group by Constituency to find local leaders and margins
    const constituencyGroups: Record<string, any[]> = {};
    candidates.forEach(c => {
      const key = `${c.type}-${c.state}-${c.constituency}`;
      if (!constituencyGroups[key]) constituencyGroups[key] = [];
      constituencyGroups[key].push(c);
    });

    // Calculate status and margin for each candidate
    candidates.forEach(c => {
      const key = `${c.type}-${c.state}-${c.constituency}`;
      const localCandidates = [...constituencyGroups[key]].sort((a, b) => b.votes - a.votes);
      
      const leader = localCandidates[0];
      const runnerUp = localCandidates[1] || { votes: 0 };

      if (c.id === leader.id) {
        c.status = "LEADING";
        c.margin = c.votes - runnerUp.votes;
      } else {
        c.status = "TRAILING";
        c.margin = leader.votes - c.votes;
      }
    });

    return candidates.sort((a, b) => b.votes - a.votes);
  } catch (error) {
    console.error("Error fetching live results:", error);
    return [];
  }
}

export async function getParties() {
  try {
    const { data, error } = await supabase
      .from('parties')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return data.map(p => ({
      id: p.id,
      name: p.name,
      shortCode: p.short_code,
      logo: p.logo_url,
      vision: p.vision,
      description: p.description,
      president: p.president,
      foundedYear: p.founded_year,
      headquarters: p.headquarters,
      color: p.color_gradient
    }));
  } catch (error) {
    console.error("Error fetching parties:", error);
    return [];
  }
}

// No default export, using named exports for clarity

