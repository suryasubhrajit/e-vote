"use client";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect, memo } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { AlertTriangle, CheckCircle2, Vote, User, Landmark, Globe, Users, Leaf, Sun, Moon, Timer, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Map of known party colors for Indian political parties
const PARTY_COLORS: Record<string, { bg: string; text: string; border: string; badge: string; icon: any; logo: string }> = {
  "BHARATIYA JAN DAL": { bg: "bg-[#FF9933]/10", text: "text-[#FF9933]", border: "border-[#FF9933]/30", badge: "bg-[#FF9933] text-white", icon: Landmark, logo: "https://iili.io/BZnvovI.png" },
  "RASHTRIYA PRAGATI DAL": { bg: "bg-[#00BFFF]/10", text: "text-[#00BFFF]", border: "border-[#00BFFF]/30", badge: "bg-[#00BFFF] text-white", icon: Globe, logo: "https://iili.io/BZnvnYN.png" },
  "JAN SEWA PARTY": { bg: "bg-[#0066CC]/10", text: "text-[#0066CC]", border: "border-[#0066CC]/30", badge: "bg-[#0066CC] text-white", icon: Users, logo: "https://iili.io/BZnvC2p.png" },
  "LOK SEWA MORCHA": { bg: "bg-[#138808]/10", text: "text-[#138808]", border: "border-[#138808]/30", badge: "bg-[#138808] text-white", icon: Leaf, logo: "https://iili.io/BZnvxpt.png" },
  "NOTA": { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-300", badge: "bg-slate-600 text-white", icon: AlertTriangle, logo: "" },
  "SWADHIN": { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", badge: "bg-slate-600 text-white", icon: User, logo: "" },
};


const getPartyStyle = (partyName: string) => {
  const upper = partyName?.toUpperCase() || "";
  for (const party of Object.keys(PARTY_COLORS)) {
    if (upper.includes(party)) return PARTY_COLORS[party];
  }
  return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", badge: "bg-blue-600 text-white", icon: Landmark, logo: "" };
};

interface CandidateCardProps {
  id: string;
  name: string;
  description: string;
  photoURL: string;
  votingOption?: boolean;
  vision?: string;
  mission?: string;
  type?: 'MP' | 'MLA';
  partyName?: string;
  partySymbolURL?: string;
  state?: string;
  constituency?: string;
  biography?: string;
  education?: string;
  assets?: string;
  liabilities?: string;
  criminal_records?: string;
  voted?: boolean;
  gender?: string;
  onVoteSuccess?: () => void;
  partyDetails?: {
    president?: string;
    foundedYear?: number;
    headquarters?: string;
    vision?: string;
    description?: string;
  };
}

const CandidateCard: React.FC<CandidateCardProps> = memo(({
  id,
  name,
  description,
  photoURL,
  votingOption = false,
  vision,
  mission = "",
  type,
  partyName = "",
  partySymbolURL,
  biography,
  education,
  assets,
  liabilities,
  criminal_records,
  voted = false,
  constituency = "",
  state = "",
  gender,
  onVoteSuccess,
  partyDetails,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVVPAT, setShowVVPAT] = useState(false);
  const router = useRouter();
  const partyStyle = getPartyStyle(partyName || description);

  const validphotoUrl = photoURL && photoURL.trim() !== "" ? photoURL : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const handleVote = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You need to be logged in to vote.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('votes')
        .insert({
          voter_profile_id: user.id,
          candidate_id: id,
          vote_type: type,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error(`You have already cast your ${type} vote.`);
          return;
        }
        throw error;
      }

      // Show VVPAT slip simulation
      setShowVVPAT(true);
      toast.success(`Your vote for ${name} (${type}) has been recorded on the EVM`);

      setTimeout(() => {
        setShowVVPAT(false);
        if (onVoteSuccess) {
          onVoteSuccess();
        } else {
          router.push("/vote");
          router.refresh(); // Ensure status updates
        }
      }, 3000);
    } catch (error) {
      toast.error("Failed to cast vote. Please try again.");
      console.error("Error updating vote:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const missionList = mission
    .split("*")
    .filter((m) => m.trim() !== "")
    .map((m) => m.trim());

  return (
    <>
      <AlertDialog>
        <Card className={`bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full w-full ${voted ? "opacity-60" : ""}`}>
          {/* Party Color Strip */}
          <div className={`h-1.5 w-full ${partyStyle.badge.split(" ")[0]}`} />

          <div className="relative">
            <div className="aspect-[3/2] overflow-hidden">
              <Image
                src={validphotoUrl}
                alt={`${name} - ${partyName || "Candidate"}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 pt-16">
                <p className="text-white text-[12px] font-black uppercase tracking-[0.2em] opacity-90 mb-1">
                  {constituency}, {state}
                </p>
                <p className="text-white text-[10px] font-bold opacity-70 uppercase tracking-widest">
                  {type === 'MP' ? 'Lok Sabha' : 'State Assembly'} Constituency
                </p>
              </div>
            </div>
            <div className="absolute bottom-[-4rem] z-10 right-4 w-24 h-24 bg-white rounded-lg shadow-lg border border-slate-100 flex items-center justify-center overflow-hidden">
              {partySymbolURL || partyStyle.logo ? (
                <Image
                  src={partySymbolURL || partyStyle.logo}
                  alt={partyName}
                  width={90}
                  height={90}
                  className="object-fill rounded"
                  loading="lazy"
                />
              ) : (
                <partyStyle.icon className={`w-8 h-8 ${partyStyle.text}`} />
              )}
            </div>
          </div>

          <CardHeader className="flex-grow p-6">
            <div className="flex justify-between items-start mb-1">
              <CardTitle className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">
                {name}
              </CardTitle>
            </div>
            <div className="h-2" />
            <div className="flex flex-wrap items-center gap-2">
              {partyDetails ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Badge className={`${partyStyle.badge} text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/20 shadow-sm whitespace-nowrap cursor-pointer hover:scale-105 transition-transform`}>
                      {partyName || description}
                    </Badge>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none p-0 overflow-hidden bg-white dark:bg-slate-950 shadow-2xl">
                    <div className="overflow-y-auto max-h-[90vh] scrollbar-hide">
                      <div className="relative h-[450px] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                        {/* Cinematic Background */}
                        {(partySymbolURL || partyDetails?.logo || partyStyle.logo) && (
                          <div className="absolute inset-0">
                            <Image 
                              src={partySymbolURL || partyDetails?.logo || partyStyle.logo || ""} 
                              alt="Background" 
                              fill 
                              className="object-cover opacity-30 blur-3xl scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
                          </div>
                        )}

                        {/* 1:1 Poster Logo */}
                        <div className="relative z-10 w-72 h-72 group">
                          <div className="absolute inset-0 bg-[#FF9933]/20 rounded-[2rem] blur-2xl group-hover:blur-3xl transition-all duration-500" />
                          <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                            {(partySymbolURL || partyDetails?.logo || partyStyle.logo) && (
                              <Image 
                                src={partySymbolURL || partyDetails?.logo || partyStyle.logo || ""} 
                                alt={partyName} 
                                fill 
                                className="object-cover" 
                              />
                            )}
                          </div>
                        </div>

                        {/* Top Badge */}
                        <div className="absolute top-6 right-6">
                          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-2">
                            <CheckCircle2 className="w-5 h-5 text-[#138808]" />
                          </div>
                        </div>
                      </div>

                      <div className="px-8 pb-8 -mt-16 relative z-20">
                        <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-8">
                          <div className="text-center space-y-2">
                            <Badge className="bg-[#FF9933] text-white border-none text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 shadow-lg mx-auto">
                              Election Commission Verified
                            </Badge>
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                              {partyName}
                            </h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                              <Landmark className="w-3 h-3" /> National Political Entity
                            </p>
                          </div>

                          {/* Key Officials & Info */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center group hover:border-[#FF9933]/30 transition-all duration-300">
                              <Users className="w-5 h-5 text-[#FF9933] mx-auto mb-2 opacity-70" />
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">President</p>
                              <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{partyDetails.president}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center group hover:border-blue-500/30 transition-all duration-300">
                              <Timer className="w-5 h-5 text-blue-500 mx-auto mb-2 opacity-70" />
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Founded</p>
                              <p className="text-[11px] font-black text-slate-900 dark:text-white">{partyDetails.foundedYear}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center group hover:border-[#138808]/30 transition-all duration-300">
                              <Globe className="w-5 h-5 text-[#138808] mx-auto mb-2 opacity-70" />
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">HQ</p>
                              <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{partyDetails.headquarters}</p>
                            </div>
                          </div>

                          {/* Vision & Mission */}
                          <div className="space-y-6 text-left">
                            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-100 dark:border-slate-800 overflow-hidden group">
                              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Trophy className="w-20 h-20" />
                              </div>
                              <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-1.5 h-4 bg-[#FF9933] rounded-full" />
                                  <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest">Strategic Vision</p>
                                </div>
                                <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                                  {partyDetails.vision}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3 px-2">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Ideology</p>
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                {partyDetails.description}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 flex justify-center">
                            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                              {(partySymbolURL || partyDetails?.logo || partyStyle.logo) && (
                                <Image 
                                  src={partySymbolURL || partyDetails?.logo || partyStyle.logo || ""} 
                                  alt="Symbol" 
                                  width={24} 
                                  height={24} 
                                  className="opacity-50 grayscale object-contain" 
                                />
                              )}
                              <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Registered Political Party of India</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Badge className={`${partyStyle.badge} text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/20 shadow-sm whitespace-nowrap`}>
                  {partyName || description}
                </Badge>
              )}

              <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black text-[9px] tracking-widest px-3 py-1.5 uppercase rounded-lg">
                {type} Candidate
              </Badge>

              {gender && (
                <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black text-[9px] tracking-widest px-3 py-1.5 uppercase rounded-lg">
                  {gender}
                </Badge>
              )}
            </div>
            <div className="h-2" />

            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              {description}
            </p>

            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed italic border-l-2 border-[#FF9933] pl-3">
              &ldquo;{vision}&rdquo;
            </p>

            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-[#138808] dark:text-green-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                Key Promises & Manifesto
              </h4>
              <ul className="space-y-1.5">
                {missionList.map((misi, index) => (
                  <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                    <span className="text-[#FF9933]">▸</span> {misi}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Legal Transparency (Form 26)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Education</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{education || "Graduate"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Assets (approx)</p>
                  <p className="text-xs font-bold text-green-600">{assets || "₹1 Cr+"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Criminal Records</p>
                  <p className={`text-xs font-bold ${criminal_records && criminal_records !== 'No Criminal Records' ? 'text-red-500' : 'text-slate-500'}`}>
                    {criminal_records || "Nil"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Liabilities</p>
                  <p className="text-xs font-bold text-red-400">{liabilities || "₹0"}</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <div className="p-6 pt-0 mt-auto">
            {votingOption ? (
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isLoading || voted}
                  variant={voted ? "secondary" : "default"}
                  className={`w-full font-bold h-12 text-base transition-all active:scale-95 ${voted
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gradient-to-r from-[#FF9933] to-[#e8851a] hover:from-[#e8851a] hover:to-[#d4780f] text-white shadow-md hover:shadow-lg"
                    }`}
                >
                  {isLoading
                    ? "Recording on EVM..."
                    : voted
                      ? `✓ ${type} Vote Recorded`
                      : (
                        <span className="flex items-center gap-2">
                          <Vote className="w-4 h-4" /> Vote for {name.split(" ")[0]}
                        </span>
                      )}
                </Button>
              </AlertDialogTrigger>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full font-bold h-12 border-slate-200 hover:bg-slate-50 transition-all">
                    View Full Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 relative rounded-xl overflow-hidden border-2 border-slate-100">
                        <Image src={validphotoUrl} alt={name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div>
                        <DialogTitle className="text-3xl font-black">{name}</DialogTitle>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{partyName || "Swadhin"} • {type} Candidate</p>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <section>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">About the Candidate</h4>
                      <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {biography || `${name} is a dedicated ${description.toLowerCase()} contesting from the ${constituency} constituency in ${state}. With a focus on ${vision?.toLowerCase()}, they aim to bring meaningful change to the region.`}
                        </p>
                      </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <section>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Vision & Mission</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900/30">
                            <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">Primary Vision</p>
                            <p className="text-sm font-medium italic">&quot;{vision}&quot;</p>
                          </div>
                          <ul className="space-y-2">
                            {missionList.map((m, i) => (
                              <li key={i} className="flex gap-2 text-sm text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>

                      <section>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Financial & Legal (Form 26)</h4>
                        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 overflow-hidden">
                          <table className="w-full text-sm">
                            <tbody className="divide-y divide-slate-100">
                              <tr>
                                <td className="p-3 font-bold text-slate-400 bg-slate-50/50">Education</td>
                                <td className="p-3 font-bold">{education}</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-bold text-slate-400 bg-slate-50/50">Total Assets</td>
                                <td className="p-3 font-bold text-green-600">{assets}</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-bold text-slate-400 bg-slate-50/50">Liabilities</td>
                                <td className="p-3 font-bold text-red-500">{liabilities}</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-bold text-slate-400 bg-slate-50/50">Criminal Records</td>
                                <td className="p-3 font-bold">{criminal_records}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </section>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </Card>

        <AlertDialogContent className="max-w-md">
          {showVVPAT ? (
            // VVPAT Slip Simulation
            <div className="text-center py-8">
              <div className="bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 max-w-xs mx-auto mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">VVPAT Slip</p>
                <div className="h-px bg-slate-200 dark:bg-slate-700 mb-3" />
                <p className="text-lg font-black text-slate-900 dark:text-white">{name}</p>
                <p className="text-xs text-slate-500 mt-1">{description}</p>
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-3" />
                <p className="text-[10px] text-slate-400">Serial: EVM-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
              </div>
              <p className="text-sm text-green-600 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Vote Confirmed via VVPAT
              </p>
              <p className="text-[10px] text-slate-400 mt-2">This slip will disappear in a few seconds...</p>
            </div>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#FF9933] rounded-lg flex items-center justify-center text-white">
                    <Vote className="w-6 h-6" />
                  </div>
                  Confirm {type} Vote
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                  You are about to cast your vote for <span className="font-bold text-slate-900 dark:text-white">{name}</span> of <span className="font-bold text-[#FF9933]">{partyName}</span> for the <span className="font-bold">{constituency}</span> {type === 'MP' ? 'Lok Sabha' : 'State Assembly'} constituency.
                  <br /><br />
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-amber-800 dark:text-amber-200">
                      As per ECB project rules, this action is <span className="font-bold underline">irreversible</span>. Your selection will be encrypted and recorded on the simulated centralized EVM.
                    </span>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-8 gap-3">
                <AlertDialogCancel className="font-bold h-12">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleVote}
                  className="bg-[#138808] hover:bg-[#0f6e06] text-white font-bold h-12 px-8 shadow-md"
                  disabled={isLoading || voted}
                >
                  Confirm & Cast {type} Vote
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

CandidateCard.displayName = "CandidateCard";

export default CandidateCard;
