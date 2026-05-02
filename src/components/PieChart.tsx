"use client";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Sector, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

type VotingData = {
  voted: number; // Jumlah user yang telah melakukan voting
  notVoted: number; // Jumlah user yang belum melakukan voting
};

type Candidate = {
  name: string; // Nama kandidat
  votes: number; // Jumlah suara yang diperoleh kandidat
};

type CandidateData = Candidate[];

export function VotingStatusPieChart({
  votingData,
}: {
  votingData: VotingData;
}) {
  const chartConfig = {
    voted: {
      label: "Voted",
      color: "hsl(var(--chart-1))",
    },
    notVoted: {
      label: "Not Voted",
      color: "hsl(var(--chart-2))",
    },
  };

  const data = [
    { name: "Voted", value: votingData.voted, fill: chartConfig.voted.color },
    {
      name: "Not Voted",
      value: votingData.notVoted,
      fill: chartConfig.notVoted.color,
    },
  ];

  return (
    <Card className="flex flex-col bg-transparent">
      <CardHeader className="items-center pb-0">
        <CardTitle>Voting Status</CardTitle>
        <CardDescription>User Voting Status</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={80}
            fill="#82ca9d"
            label={({ name, value }) => `${name}: ${value}`}
          />
          <Tooltip />
        </PieChart>
      </CardContent>
    </Card>
  );
}

export function CandidateVotesPieChart({
  candidateData,
}: {
  candidateData: CandidateData;
}) {
  const data = candidateData.map((candidate: Candidate) => ({
    name: candidate.name,
    value: candidate.votes,
  }));

  return (
    <Card className="flex flex-col bg-transparent">
      <CardHeader className="items-center pb-0">
        <CardTitle>Candidate Votes</CardTitle>
        <CardDescription>Votes Distribution by Candidate</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${value}`}
          />
          <Tooltip />
        </PieChart>
      </CardContent>
    </Card>
  );
}
