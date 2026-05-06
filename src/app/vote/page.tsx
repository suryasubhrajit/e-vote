import VotePage from "@/components/VotePage";

export const metadata = {
  title: "Cast Your Vote | Digital Ballot Box",
  description: "Securely cast your vote for MP and MLA candidates in your constituency. Aadhaar verification and VVPAT confirmation included.",
};

export default function VoteRoute() {
  return (
    <>
      <VotePage />
    </>
  );
}
