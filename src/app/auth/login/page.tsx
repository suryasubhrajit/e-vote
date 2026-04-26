import LoginPage from "@/components/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voter Authentication | Bharat Election Portal",
  description: "Sign in to access the digital voting portal — भारत निर्वाचन पोर्टल",
};

export default function LoginRoute() {
  return (
    <>
      <LoginPage />
    </>
  );
}
