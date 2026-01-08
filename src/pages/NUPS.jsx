/**
 * NUPS Unified Clock Module
 * SINGLE SOURCE OF TRUTH
 *
 * • Admin / Manager / Staff → Staff Time Clock
 * • Entertainer → Entertainer Check-In ONLY
 * • Mandatory Contract Agreement Checkbox
 * • NO DUPLICATE CLOCKS
 * • NO ROLE COLLISION
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, LogIn, LogOut, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useAccessControl } from "@/components/nups/ProtectedField";

/* ===============================
   MAIN COMPONENT
   =============================== */

export default function TimeClockContent() {
  const { userRole } = useAccessControl();
  const role = (userRole || "user").toLowerCase();

  // ROLE ROUTING — THIS IS THE FIX
  if (role === "entertainer") {
    return <EntertainerCheckIn />;
  }

  return <StaffTimeClock />;
}

/* ===============================
   STAFF / ADMIN TIME CLOCK
   =============================== */

function StaffTimeClock() {
  const [clockedIn, setClockedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const duration =
    clockedIn && startTime
      ? Math.floor((now - startTime) / 60000)
      : null;

  return (
    <Card className="bg-slate-900/60 border-cyan-500/40">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Staff Time Clock
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-center">
        <div className="text-5xl font-mono text-cyan-400">
          {now.toLocaleTimeString()}
        </div>

        {clockedIn ? (
          <>
            <Badge className="bg-green-500/20 text-green-400">
              On Shift — {Math.floor(duration / 60)}h {duration % 60}m
            </Badge>

            <Button
              className="w-full h-14 bg-gradient-to-r from-red-600 to-orange-600 text-lg"
              onClick={() => {
                setClockedIn(false);
                setStartTime(null);
                toast.success("Clocked out");
              }}
            >
              <LogOut className="mr-2" /> Clock Out
            </Button>
          </>
        ) : (
          <Button
            className="w-full h-14 bg-gradient-to-r from-green-600 to-cyan-600 text-lg"
            onClick={() => {
              setClockedIn(true);
              setStartTime(new Date());
              toast.success("Clocked in");
            }}
          >
            <LogIn className="mr-2" /> Clock In
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/* ===============================
   ENTERTAINER CHECK-IN (CONTRACT)
   =============================== */

function EntertainerCheckIn() {
  const [agreed, setAgreed] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <Card className="bg-slate-900/60 border-rose-500/40">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-rose-400" />
          Entertainer Check-In
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="p-4 bg-slate-800/60 rounded-lg text-sm text-slate-300">
          By checking in, you confirm that you have read, understand,
          and agree to all active Entertainer Agreements, Club Policies,
          and Compensation Terms currently on file.
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="agree"
            checked={agreed}
            onCheckedChange={setAgreed}
          />
          <label htmlFor="agree" className="text-sm text-white">
            I agree to the Entertainer Agreement & Terms
          </label>
        </div>

        <Button
          disabled={!agreed || checkedIn}
          className={`w-full h-14 text-lg ${
            agreed
              ? "bg-gradient-to-r from-rose-600 to-pink-600"
              : "bg-slate-700 cursor-not-allowed"
          }`}
          onClick={() => {
            setCheckedIn(true);
            toast.success("Entertainer checked in");
          }}
        >
          {checkedIn ? "Checked In" : "Check In"}
        </Button>
      </CardContent>
    </Card>
  );
}
