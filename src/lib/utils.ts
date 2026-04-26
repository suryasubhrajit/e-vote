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
  const regex = /^[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}$/;
  return regex.test(aadhaar);
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
    photoURL: candidate.photo_url || `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(candidate.name || 'candidate')}`,
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
  totalVoters: number;
  totalCandidates: number;
  voterTurnout: number;
}> {
  try {
    const [votersRes, candidatesRes, usersRes] = await Promise.all([
      // Fetching total voters who have cast at least one vote
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .or('voted_mp.eq.true,voted_mla.eq.true'),
      
      // Fetching total candidates
      supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true }),
      
      // Calculating voter turnout
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
    ]);

    if (votersRes.error) throw votersRes.error;
    if (candidatesRes.error) throw candidatesRes.error;
    if (usersRes.error) throw usersRes.error;

    const totalVoters = votersRes.count ?? 0;
    const totalCandidates = candidatesRes.count ?? 0;
    const totalUsers = usersRes.count ?? 0;

    const voterTurnout = totalUsers > 0 ? (totalVoters / totalUsers) * 100 : 0;

    return {
      totalVoters,
      totalCandidates,
      voterTurnout,
    };
  } catch (error) {
    console.error("Error fetching election stats:", error);
    throw new Error("Failed to fetch election statistics");
  }
}

// No default export, using named exports for clarity

