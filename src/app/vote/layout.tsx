import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVM Ballot | Bharat Election Portal",
  description: "Cast your vote on the Electronic Voting Machine — Lok Sabha 2029",
};

export default function VoteLayout({
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
