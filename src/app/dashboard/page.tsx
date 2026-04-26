import { DashboardPage } from "@/components/DashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ECI Admin Panel | Bharat Election Portal",
  description: "Election analytics and administration dashboard",
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
