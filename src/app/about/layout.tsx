import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Bharat Election Portal",
  description: "Election Commission of India — Governance & Transparency",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
