import Homepage from "@/components/HomePage";

export const metadata = {
  title: "Bharat Election Project | Secure Digital Voting Portal",
  description: "Cast your vote securely in the 18th Lok Sabha General Election simulation. Aadhaar-verified digital ballot powered by the Election Commission of Bharat (ECB).",
  keywords: ["Election", "Voting", "Aadhaar", "India", "Digital Ballot", "EVM", "VVPAT"],
};

export default function HomeRoute() {
  return (
    <>
      <Homepage />
    </>
  );
}
