import RegisterPage from "@/components/RegisterPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voter Registration | Bharat Election Portal",
  description: "Register as a citizen voter — मतदाता पंजीकरण",
};

export default function RegisterRoute() {
  return (
    <>
      <RegisterPage />
    </>
  );
}
