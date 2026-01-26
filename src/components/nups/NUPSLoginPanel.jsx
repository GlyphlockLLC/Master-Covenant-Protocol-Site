import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, User, Briefcase, Mic } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GlyphInput, GlyphButton, GlyphFormPanel } from "@/components/ui/GlyphForm";

export default function NUPSLoginPanel() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    mfaCode: "",
    staffName: "",
    pin: "",
    dancerName: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const staffList = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      switch (role) {
        case 'admin':
          if (formData.email && formData.password) {
            navigate('/nups-owner');
          } else {
            setError("Please enter email and password.");
          }
          break;
        case 'staff':
          if (formData.staffName && formData.pin.length === 4) {
            navigate('/nups-staff');
          } else {
            setError("Please select name and enter 4-digit PIN.");
          }
          break;
        case 'entertainer':
          if (formData.dancerName && formData.password) {
            navigate('/nups-time-clock');
          } else {
            setError("Please enter dancer name and password.");
          }
          break;
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-lg font-semibold text-white/80 mb-2">Select Your Role</h2>
      <GlyphButton onClick={() => setRole('admin')} variant="outline" className="w-full">
        <Shield className="w-4 h-4 mr-2" /> Admin
      </GlyphButton>
      <GlyphButton onClick={() => setRole('staff')} variant="outline" className="w-full">
        <Briefcase className="w-4 h-4 mr-2" /> Staff
      </GlyphButton>
      <GlyphButton onClick={() => setRole('entertainer')} variant="outline" className="w-full">
        <Mic className="w-4 h-4 mr-2" /> Entertainer
      </GlyphButton>
    </div>
  );

  const renderLoginForm = () => {
    let formContent;
    let title = "Sign In";

    switch (role) {
      case 'admin':
        title = "Admin Login";
        formContent = (
          <>
            <GlyphInput
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <GlyphInput
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <GlyphInput
              type="text"
              placeholder="MFA Code"
              value={formData.mfaCode}
              onChange={(e) => setFormData({...formData, mfaCode: e.target.value})}
            />
          </>
        );
        break;
      case 'staff':
        title = "Staff Clock-In";
        formContent = (
          <>
            <select
              value={formData.staffName}
              onChange={(e) => setFormData({...formData, staffName: e.target.value})}
              className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
            >
              <option value="" disabled>Select your name</option>
              {staffList.map(staff => (
                <option key={staff.id} value={staff.name}>{staff.name}</option>
              ))}
            </select>
            <GlyphInput
              type="password"
              placeholder="Enter PIN"
              value={formData.pin}
              onChange={(e) => setFormData({...formData, pin: e.target.value})}
              maxLength="4"
            />
          </>
        );
        break;
      case 'entertainer':
        title = "Entertainer Sign-In";
        formContent = (
          <>
            <GlyphInput
              type="text"
              placeholder="Enter your Dancer Name"
              value={formData.dancerName}
              onChange={(e) => setFormData({...formData, dancerName: e.target.value})}
            />
            <GlyphInput
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </>
        );
        break;
    }

    return (
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <h2 className="text-center text-lg font-semibold text-white/80 mb-2">{title}</h2>
        {formContent}
        <GlyphButton type="submit" variant="mixed" className="w-full mt-2">
          {loading ? 'Authenticating...' : role === 'staff' ? 'Clock In' : 'Sign In'}
        </GlyphButton>
        <button 
          type="button" 
          onClick={() => setRole(null)} 
          className="text-sm text-white/60 hover:underline mt-2"
        >
          Back to role selection
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF]/20 via-[#7C3AED]/10 to-[#3B82F6]/20" />
      
      <div className="relative z-10">
        <GlyphFormPanel title="">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black">
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] bg-clip-text text-transparent">N.U.P.S.</span>
              {" "}<span className="text-white">POS</span>
            </h1>
            <p className="text-white/60 mt-1 text-sm">Nexus Universal Point-of-Sale</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-500/20 border-red-500/50">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {role ? renderLoginForm() : renderRoleSelection()}
        </GlyphFormPanel>
      </div>
    </div>
  );
}