"use client";

import { useState, useEffect } from "react";
import CandidatesList from "./CandidateList";
import { useAuthMiddleware } from "@/app/auth/middleware/useAuthMiddleware";
import { ShieldCheck, Info, Fingerprint, CreditCard, CheckCircle2, AlertTriangle, Vote } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { fetchCandidates, validateAadhaar } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Candidate from "./types/CandidateType";
import CandidateCard from "./CandidateCard";

// ECB-style Voter ID & Aadhaar verification step
const VerificationGate = ({ onVerified, user }: { onVerified: (voter: any) => void; user: any }) => {
  const [step, setStep] = useState<"aadhaar" | "otp" | "verified">("aadhaar");
  const [aadhaar, setAadhaar] = useState("");
  const [voterId, setVoterId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchedVoter, setMatchedVoter] = useState<any>(null);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleSearchVoter = async () => {
    if (!validateAadhaar(aadhaar)) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    if (!voterId || voterId.length < 10) {
      toast.error("Please enter a valid Voter ID (EPIC Number)");
      return;
    }

    setLoading(true);
    try {
      const cleanAadhaar = aadhaar.replace(/\s/g, "");
      const { data, error } = await supabase
        .from('voters')
        .select('*')
        .eq('voter_id_epic', voterId.trim().toUpperCase())
        .eq('aadhar_number', cleanAadhaar)
        .single();

      if (error || !data) {
        toast.error("No voter record found with these credentials in the project database.");
        setLoading(false);
        return;
      }

      if (data.linked_profile_id && data.linked_profile_id !== user.id) {
        toast.error("This Voter ID is already linked to another account.");
        setLoading(false);
        return;
      }

      setMatchedVoter(data);
      // Simulate sending OTP to registered mobile
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      console.log("Simulated ECB OTP:", newOtp);
      
      setStep("otp");
      toast.success(`OTP sent to mobile ending in ${data.phone_number.slice(-4)}`);
    } catch (err) {
      console.error(err);
      toast.error("Verification system unavailable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp !== generatedOtp && otp !== "123456") { // Allow 123456 for easy demo
      toast.error("Invalid OTP. Please check the code sent to your phone.");
      return;
    }

    setLoading(true);
    try {
      // 1. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_voter_verified: true,
          linked_voter_id: matchedVoter.id,
          state: matchedVoter.state,
          constituency_mp: matchedVoter.constituency_mp,
          constituency_mla: matchedVoter.constituency_mla
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Link Voter record back to profile (Permanent Link)
      const { error: voterError } = await supabase
        .from('voters')
        .update({ linked_profile_id: user.id })
        .eq('id', matchedVoter.id);

      if (voterError) throw voterError;

      setStep("verified");
      toast.success("Identity verified and permanently linked to this account!");
      setTimeout(() => onVerified(matchedVoter), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to link account. Please contact technical support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24">
      <section className="mx-auto container px-4 md:px-8 max-w-xl">
        <div className="h-1.5 w-full flex rounded-t-xl overflow-hidden mb-0">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white dark:bg-slate-300" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-b-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#FF9933] to-[#e8851a] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Fingerprint className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
              Bharat Election Project
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Identity Verification via Aadhaar & EPIC (Voter ID)
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10">
            {[
              { label: "Credentials", active: step === "aadhaar" || step === "otp" || step === "verified" },
              { label: "OTP", active: step === "otp" || step === "verified" },
              { label: "Verified", active: step === "verified" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${s.active
                    ? "bg-[#138808] text-white shadow-md"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                  }`}>
                  {i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${s.active ? "text-slate-900 dark:text-white" : "text-slate-400"
                  }`}>{s.label}</span>
                {i < 2 && <div className={`w-8 h-0.5 ${s.active ? "bg-[#138808]" : "bg-slate-200 dark:bg-slate-700"}`} />}
              </div>
            ))}
          </div>

          {step === "aadhaar" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="voterId" className="text-sm font-bold text-slate-700 dark:text-slate-300">Voter ID (EPIC Number)</Label>
                <Input
                  id="voterId"
                  placeholder="e.g. ABC1234567"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value.toUpperCase())}
                  className="h-12 text-lg tracking-widest font-mono text-center"
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaar" className="text-sm font-bold text-slate-700 dark:text-slate-300">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(formatAadhaar(e.target.value))}
                  className="h-12 text-lg tracking-widest font-mono text-center"
                  maxLength={14}
                />
              </div>

              <Button
                onClick={handleSearchVoter}
                disabled={loading}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-[#FF9933] to-[#e8851a] text-white"
              >
                {loading ? "Searching ECI Database..." : "Search Voter Record"}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 rounded-xl">
                <p className="text-xs text-blue-800 dark:text-blue-300 font-bold mb-1">RECORD MATCHED: {matchedVoter?.full_name}</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400">Constituency: {matchedVoter?.constituency_mp}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-bold">Enter 6-digit OTP sent to ending {matchedVoter?.phone_number.slice(-4)}</Label>
                <Input
                  id="otp"
                  placeholder="● ● ● ● ● ●"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-14 text-2xl tracking-[0.5em] font-mono text-center"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full h-12 text-base font-bold bg-[#138808] text-white"
              >
                {loading ? "Linking Account..." : "Confirm & Link Account"}
              </Button>
            </div>
          )}

          {step === "verified" && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-[#138808] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verification Complete</h3>
              <p className="text-sm text-slate-500 mt-2">Proceeding to secure voting terminal...</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              <strong>SECURE ECB GATEWAY:</strong> Verification ensures one vote per citizen. 
              By proceeding, you agree that your Google Account and Device will be permanently 
              linked to this Voter Identity for the duration of this project.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function VotePage() {
  const { user } = useAuthMiddleware();
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedVoter, setVerifiedVoter] = useState<any>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votedMP, setVotedMP] = useState(false);
  const [votedMLA, setVotedMLA] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // 1. Fetch Profile and check verification
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, voters(*)')
        .eq('id', user.id)
        .single();

      if (profile) {
        // 1b. Check if voted in the dedicated 'votes' table
        const { data: votesData } = await supabase
          .from('votes')
          .select('vote_type')
          .eq('voter_profile_id', user.id);
        
        const votedMPStatus = votesData?.some(v => v.vote_type === 'MP') || false;
        const votedMLAStatus = votesData?.some(v => v.vote_type === 'MLA') || false;

        setVotedMP(votedMPStatus);
        setVotedMLA(votedMLAStatus);
        
        if (profile.is_voter_verified && profile.voters) {
          setVerifiedVoter(profile.voters);
          setIsVerified(true);
          
          // 2. Fetch candidates for THIS voter's specific constituency
          const { data: candData } = await supabase
            .from('candidates')
            .select('*')
            .eq('state', profile.voters.state)
            .or(`constituency.eq.${profile.voters.constituency_mp},constituency.eq.${profile.voters.constituency_mla}`);

          if (candData) {
            setCandidates(candData.map(c => ({
              ...c,
              photoURL: c.photo_url || `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(c.name || 'candidate')}`,
              partySymbolURL: c.party_symbol_url,
              id: c.id,
              name: c.name,
              description: c.description,
              type: c.type,
              partyName: c.party_name,
              state: c.state,
              constituency: c.constituency,
              biography: c.biography,
              education: c.education,
              assets: c.assets,
              liabilities: c.liabilities,
              criminal_records: c.criminal_records,
              district: c.district
            })));
          }
        } else {
          // If not verified, we still load all candidates for the preview (optional) or just wait
          const allCands = await fetchCandidates();
          setCandidates(allCands);
        }
      }
    } catch (error) {
      console.error("Error loading voting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!isVerified) {
    return <VerificationGate user={user} onVerified={(voter) => {
      setVerifiedVoter(voter);
      setIsVerified(true);
      loadData(); // Re-fetch candidates for the specific constituency
    }} />;
  }

  const mpCandidates = candidates.filter(c => c.type === 'MP' && c.constituency === verifiedVoter?.constituency_mp);
  const mlaCandidates = candidates.filter(c => c.type === 'MLA' && c.constituency === verifiedVoter?.constituency_mla);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24">
      <div className="fixed top-[64px] left-0 right-0 h-1 flex z-40">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white dark:bg-slate-300" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <section className="mx-auto container px-4 md:px-8 max-w-7xl">
        <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-[#FF9933] hover:bg-[#e8851a] text-white border-none px-4 py-1 font-bold">
              Official EVM Terminal
            </Badge>
            <Badge variant="outline" className="border-[#138808] text-[#138808] dark:border-green-400 dark:text-green-400 px-3 py-1 text-[10px] font-bold">
              CONSTITUENCY: {verifiedVoter?.constituency_mp} ({verifiedVoter?.state})
            </Badge>
            <div className="ml-auto flex gap-2">
              <div className={`h-2 w-12 rounded-full ${votedMP ? "bg-[#138808]" : "bg-slate-200"}`} />
              <div className={`h-2 w-12 rounded-full ${votedMLA ? "bg-[#138808]" : "bg-slate-200"}`} />
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
            Namaste, {verifiedVoter?.full_name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
            You are currently accessing the secure digital ballot for <strong>{verifiedVoter?.district}</strong> district. 
            Please cast your votes for your local representatives below.
          </p>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-8">
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-[#138808] rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">EPIC NUMBER</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {verifiedVoter?.voter_id_epic}
                </div>
              </div>
            </div>

            <Alert className="max-w-md bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider">Device Locked</AlertTitle>
              <AlertDescription className="text-xs text-amber-800 dark:text-amber-300 leading-tight">
                This account and device are now permanently linked to Voter ID {verifiedVoter?.voter_id_epic}. 
                Sign-out is disabled to prevent electoral fraud.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* MP Section */}
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black">MP</div>
              <div>
                <h2 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Lok Sabha (Member of Parliament)</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Candidates for {verifiedVoter?.constituency_mp} Constituency
                </p>
              </div>
            </div>
            {votedMP && <Badge className="bg-[#138808] text-white">✓ VOTE RECORDED</Badge>}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-2xl" />)}
            </div>
          ) : mpCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mpCandidates.map(candidate => (
                <CandidateCard key={candidate.id} {...candidate} votingOption={!votedMP} voted={votedMP} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-100 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 font-bold">No MP candidates found for your constituency.</p>
            </div>
          )}
        </section>

        {/* MLA Section */}
        <section className="mb-20">
          <div className="mb-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF9933] text-white rounded-lg flex items-center justify-center font-black">MLA</div>
              <div>
                <h2 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">State Assembly (MLA)</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Candidates for {verifiedVoter?.constituency_mla} Constituency
                </p>
              </div>
            </div>
            {votedMLA && <Badge className="bg-[#138808] text-white">✓ VOTE RECORDED</Badge>}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-2xl" />)}
            </div>
          ) : mlaCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mlaCandidates.map(candidate => (
                <CandidateCard key={candidate.id} {...candidate} votingOption={!votedMLA} voted={votedMLA} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-100 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 font-bold">No MLA candidates found for your constituency.</p>
            </div>
          )}
        </section>

        <div className="mt-16 text-center space-y-4">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.3em]">
            Digital EVM Project Terminal v3.0 • Election Commission of Bharat
          </p>
          <div className="h-1 w-48 mx-auto flex rounded-full overflow-hidden">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#138808]" />
          </div>
        </div>
      </section>
    </div>
  );
}
