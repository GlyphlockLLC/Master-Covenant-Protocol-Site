import React, { useState } from "react";
import { base44 } from "@/api/base44Client";

/**
 * GLYPHLOCK VERIFICATION GATE
 * Protocol-governed submission checkpoint
 * 
 * DESIGN PHILOSOPHY:
 * - Authoritative, not friendly
 * - Dark, minimal, geometric
 * - No playful elements
 * - Enforcement, not experience
 */

export default function VerificationGate({ onVerified, disabled = false }) {
  const [status, setStatus] = useState("idle"); // idle | verifying | verified | failed
  const [token, setToken] = useState(null);

  const handleVerification = async () => {
    setStatus("verifying");

    try {
      const response = await base44.functions.invoke("generateVerificationToken", {
        origin: window.location.origin,
        timestamp: Date.now()
      });

      if (response.data?.token) {
        setToken(response.data.token);
        setStatus("verified");
        onVerified(response.data.token);
      } else {
        setStatus("failed");
      }
    } catch (error) {
      setStatus("failed");
    }
  };

  if (status === "verified") {
    return (
      <div className="border border-slate-700 bg-slate-950 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 tracking-[0.2em] mb-1">VERIFICATION GATE</div>
            <div className="text-white font-medium">Request integrity confirmed</div>
          </div>
          <div className="w-2 h-2 bg-green-600"></div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="border border-slate-700 bg-slate-950 p-6">
        <div className="text-xs text-slate-500 tracking-[0.2em] mb-2">VERIFICATION GATE</div>
        <div className="text-red-400 font-medium mb-4">Verification failed. Submission rejected.</div>
        <button
          onClick={handleVerification}
          className="w-full py-3 bg-slate-900 border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors"
          disabled={disabled}
        >
          Retry Verification
        </button>
      </div>
    );
  }

  return (
    <div className="border border-slate-700 bg-slate-950 p-6">
      <div className="mb-5">
        <div className="text-white text-sm font-bold tracking-wide mb-2">
          Verification Gate Active
        </div>
        <div className="text-slate-400 text-sm mb-1">
          Confirm request integrity to proceed.
        </div>
        <div className="text-slate-600 text-xs tracking-[0.15em]">
          Protocol governed submission
        </div>
      </div>

      <button
        onClick={handleVerification}
        disabled={disabled || status === "verifying"}
        className="w-full py-3 bg-slate-900 border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "verifying" ? "Verifying..." : "Confirm & Proceed"}
      </button>
    </div>
  );
}