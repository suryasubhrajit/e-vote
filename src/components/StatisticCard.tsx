"use client";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NumberTicker from "./magicui/number-ticker";

interface StatisticCardProps {
  number: number;
  description: string;
  isPercentage?: boolean;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  number,
  description,
  isPercentage = false,
}) => {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden">
      <CardHeader className="text-center p-8">
        <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
          <NumberTicker value={number} />
          {isPercentage ? "%" : ""}
        </div>
        <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default StatisticCard;
