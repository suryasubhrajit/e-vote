"use client";

import { toast } from "sonner";
import { useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import RetroGrid from "@/components/magicui/retro-grid";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthMiddleware } from "@/app/auth/middleware/useAuthMiddleware";
import { Landmark, UserPlus, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";
import { validateAadhaar, validatePAN } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [aadhar, setAadhar] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [constituencyMP, setConstituencyMP] = useState<string>("");
  const [constituencyMLA, setConstituencyMLA] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, loading } = useAuthMiddleware();

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  if (loading) {
    return <Loader loading={loading} />;
  }

  if (user) {
    return null;
  }

  const handleRegister = async () => {
    if (password.length < 6) {
      toast.error("Password must be longer than 6 characters!");
      return;
    }

    if (!name || !email || !password || !aadhar || !pan || !age || !gender || !state || !constituencyMP || !constituencyMLA) {
      toast.error("All fields are required!");
      return;
    }

    if (!validateAadhaar(aadhar)) {
      toast.error("Invalid Aadhaar number format! (XXXX XXXX XXXX)");
      return;
    }

    if (!validatePAN(pan)) {
      toast.error("Invalid PAN card format! (ABCDE1234F)");
      return;
    }

    if (parseInt(age) < 18) {
      toast.error("You must be at least 18 years old to register as a voter!");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            aadhar_number: aadhar,
            pan_card: pan,
            age: parseInt(age),
            gender: gender,
            state: state,
            constituency_mp: constituencyMP,
            constituency_mla: constituencyMLA,
          },
        },
      });

      if (error) throw error;

      toast.success("Registration successful! Please verify your email.");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Error registering:", error);
      toast.error(error.message || "Registration failed!");
    } finally {
      setIsLoading(false);
    }
  };


  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  return (
    <>
      <Loader loading={isLoading} />

      <div className="flex justify-center items-center w-full h-[100vh]">
        <RetroGrid />

        <Card className="overflow-hidden">
          {/* Tricolor top line */}
          <div className="h-1.5 w-full flex">
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white dark:bg-slate-300" />
            <div className="flex-1 bg-[#138808]" />
          </div>

          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF9933] to-[#e8851a] rounded-xl flex items-center justify-center shadow-md">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-black">Voter Registration</CardTitle>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                  मतदाता पंजीकरण • Bharat Election Portal
                </p>
              </div>
            </div>
            <CardDescription className="max-h-[60vh] overflow-y-auto px-1 pr-4 custom-scrollbar">
              <div className="flex justify-between items-center mb-6 mt-2">
                 <div className="flex gap-1">
                    {[1, 2, 3].map((s) => (
                       <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${step >= s ? "bg-[#FF9933]" : "bg-slate-200"}`} />
                    ))}
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {step} of 3</span>
              </div>

              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-bold text-slate-700 dark:text-slate-300">Full Name (as per Voter ID)</Label>
                    <Input id="fullName" placeholder="Rajesh Kumar Singh" required onChange={handleInputChange(setName)} value={name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-slate-700 dark:text-slate-300">Email Address</Label>
                    <Input type="email" id="email" placeholder="voter@example.com" required onChange={handleInputChange(setEmail)} value={email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-bold text-slate-700 dark:text-slate-300">Password</Label>
                    <Input type="password" id="password" placeholder="Min. 6 characters" required onChange={handleInputChange(setPassword)} value={password} />
                  </div>
                  <Button className="w-full mt-4 bg-slate-900 text-white font-bold h-12" onClick={() => setStep(2)}>
                    Next: Identification <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="aadhar" className="font-bold text-slate-700 dark:text-slate-300">Aadhaar Number</Label>
                    <Input id="aadhar" placeholder="XXXX XXXX XXXX" required onChange={handleInputChange(setAadhar)} value={aadhar} maxLength={14} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan" className="font-bold text-slate-700 dark:text-slate-300">PAN Card Number</Label>
                    <Input id="pan" placeholder="ABCDE1234F" required onChange={(e) => setPan(e.target.value.toUpperCase())} value={pan} maxLength={10} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="font-bold text-slate-700 dark:text-slate-300">Age</Label>
                      <Input id="age" type="number" placeholder="18+" required onChange={handleInputChange(setAge)} value={age} min="18" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="font-bold text-slate-700 dark:text-slate-300">Gender</Label>
                      <Select onValueChange={setGender} value={gender}>
                        <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button variant="outline" className="flex-1 font-bold h-12" onClick={() => setStep(1)}>
                      <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button className="flex-[2] bg-slate-900 text-white font-bold h-12" onClick={() => setStep(3)}>
                      Next: Constituency <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="state" className="font-bold text-slate-700 dark:text-slate-300">State</Label>
                    <Select onValueChange={setState} value={state}>
                      <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                      <SelectContent>
                        {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mp" className="font-bold text-slate-700 dark:text-slate-300">Lok Sabha Constituency (MP)</Label>
                    <Input id="mp" placeholder="e.g. Varanasi" required onChange={handleInputChange(setConstituencyMP)} value={constituencyMP} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mla" className="font-bold text-slate-700 dark:text-slate-300">Assembly Constituency (MLA)</Label>
                    <Input id="mla" placeholder="e.g. Varanasi North" required onChange={handleInputChange(setConstituencyMLA)} value={constituencyMLA} />
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" className="flex-1 font-bold h-12" onClick={() => setStep(2)}>
                      <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      className="flex-[2] bg-gradient-to-r from-[#FF9933] to-[#e8851a] hover:from-[#e8851a] hover:to-[#d4780f] text-white font-bold h-12"
                      onClick={handleRegister}
                      disabled={isLoading}
                    >
                      {isLoading ? "Registering..." : "Finalize Registration"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center gap-2 justify-center text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Secured under ECI Guidelines (Simulated)</span>
              </div>

              <p className="m-auto mt-6 text-sm text-center">
                Already registered? Sign In{" "}
                <Link href={"/auth/login"} className="font-bold underline text-[#FF9933]">
                  Here
                </Link>
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
