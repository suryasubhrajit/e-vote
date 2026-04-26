"use client";

import { ShieldCheck, Fingerprint, Scale, FileText, Landmark, ShieldAlert, Vote, MapPin, Users } from "lucide-react";
import { Badge } from "./ui/badge";

export default function AboutPage() {
  const sections = [
    {
      title: "Election Commission of Bharat",
      description: "The ECB (Project Only) is a simulated authority responsible for demonstrating digital election processes. This simulation ensures a glimpse into fair and transparent digital voting.",
      icon: <Landmark className="w-8 h-8 text-[#000080]" />,
      color: "bg-blue-50"
    },
    {
      title: "Aadhaar-Based e-KYC",
      description: "Voter identity is verified using UIDAI's Aadhaar Authentication framework with biometric/OTP-based e-KYC. This eliminates impersonation and ensures 'One Citizen, One Vote' integrity.",
      icon: <Fingerprint className="w-8 h-8 text-[#FF9933]" />,
      color: "bg-orange-50"
    },
    {
      title: "EVM & VVPAT Security",
      description: "Votes are cast on tamper-proof Electronic Voting Machines with Voter-Verifiable Paper Audit Trail. Each EVM is manufactured by BEL and ECIL under strict security protocols.",
      icon: <ShieldCheck className="w-8 h-8 text-[#138808]" />,
      color: "bg-green-50"
    },
    {
      title: "Model Code of Conduct",
      description: "All candidates and parties must adhere to the MCC from announcement of elections until results. Violations are monitored 24/7 using the cVIGIL app and flying squads.",
      icon: <ShieldAlert className="w-8 h-8 text-red-600" />,
      color: "bg-red-50"
    },
    {
      title: "Constituency-Based Voting",
      description: "India is divided into 543 Lok Sabha constituencies. Each constituency elects one Member of Parliament through First Past the Post (FPTP) voting system.",
      icon: <MapPin className="w-8 h-8 text-purple-600" />,
      color: "bg-purple-50"
    },
    {
      title: "Universal Adult Franchise",
      description: "Every Indian citizen aged 18 and above has the right to vote regardless of caste, religion, gender, or economic status — guaranteed by Article 326 of the Constitution.",
      icon: <Users className="w-8 h-8 text-teal-600" />,
      color: "bg-teal-50"
    },
  ];

  const electionFacts = [
    { label: "Total Constituencies", value: "543" },
    { label: "Eligible Voters (2024)", value: "96.8 Cr" },
    { label: "Polling Stations", value: "10.5 Lakh+" },
    { label: "Majority Mark", value: "272 Seats" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-24">
      {/* Tricolor accent */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white dark:bg-slate-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <section className="mx-auto container px-4 md:px-8 max-w-5xl">
        <div className="text-center mb-20 pt-8">
          <Badge variant="outline" className="mb-4 border-[#000080] text-[#000080] dark:border-[#FF9933] dark:text-[#FF9933] font-bold uppercase tracking-[0.2em] px-4 py-1">
            भारत निर्वाचन प्रोजेक्ट • Election Commission of Bharat (ECB)
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            Securing India&apos;s <span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] bg-clip-text text-transparent">Democratic Process.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            This digital voting platform simulates the Indian electoral process — from Aadhaar-based voter 
            verification to EVM ballot casting — providing an educational demonstration of how the world&apos;s 
            largest democracy conducts its elections.
          </p>
        </div>

        {/* Quick Election Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {electionFacts.map((fact, i) => (
            <div key={i} className="text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{fact.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{fact.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div key={index} className="group p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:border-[#FF9933]/30 transition-all">
              <div className={`w-16 h-16 ${section.color} dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                {section.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {section.description}
              </p>
            </div>
          ))}
        </div>

        {/* Key Electoral Laws */}
        <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#000080]" /> Key Electoral Laws & Acts
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { law: "Representation of the People Act, 1950", desc: "Governs electoral rolls and seat allocation" },
              { law: "Representation of the People Act, 1951", desc: "Regulates conduct of elections and disputes" },
              { law: "Article 324 of Constitution", desc: "Vests superintendence in the Election Commission" },
              { law: "Article 326 of Constitution", desc: "Guarantees universal adult suffrage" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl">
                <FileText className="w-5 h-5 text-[#FF9933] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{item.law}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 p-12 rounded-3xl bg-gradient-to-r from-[#FF9933]/5 via-transparent to-[#138808]/5 border border-slate-200 dark:border-slate-800 text-center">
          <Landmark className="w-12 h-12 text-[#000080] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            सत्यमेव जयते — Truth Alone Triumphs
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            This platform is a DUMMY PROJECT and is NOT affiliated with the Election Commission of India, 
            Election Commission of Bharat (Actual), UIDAI, or any government body. Built for educational and 
            demonstration purposes.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <span className="flex items-center gap-2"><Scale className="w-4 h-4" /> Project Guidelines</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> ECB Simulation</span>
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> VVPAT Simulation</span>
          </div>
        </div>
      </section>
    </div>
  );
}
