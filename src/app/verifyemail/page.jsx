"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(`/api/users/verifyemail`, { token });
        const data = res.data;

        if (res.status === 200) {
          setStatus("✅ Email verified successfully! Redirecting to login...");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setStatus(data.error || "❌ Verification failed.");
        }
      } catch (err) {
        console.error("Verification error:", err.response?.data || err.message);
        setStatus(
          err.response?.data?.error ||
            "⚠️ Something went wrong during verification."
        );
      }
    };

    if (token) verify();
  }, [token, router]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-xl font-bold text-center max-w-md">{status}</h1>
    </div>
  );
}
