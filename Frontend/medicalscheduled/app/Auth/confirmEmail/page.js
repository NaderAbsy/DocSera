"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const response = await fetch(
          `https://localhost:44316/api/auth/confirm-email?token=${token}&email=${email}`,
          { method: "GET" }
        );
        if (response.ok) {
          setStatus("✅ Email confirmed successfully! Redirecting to login...");
          setTimeout(() => router.push("/"), 3000); 
        } else {
          setStatus("❌ Invalid or expired confirmation link.");
        }
      } catch (err) {
        setStatus("⚠️ Error confirming email.");
      } finally {
        setLoading(false);
      }
    }

    if (token && email) verify();
  }, [token, email, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Email Confirmation</h1>
        <p
          className={`text-lg ${
            status.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
        {loading && (
          <div className="mt-6 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
