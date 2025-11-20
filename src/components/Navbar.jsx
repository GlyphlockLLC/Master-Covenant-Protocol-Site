import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronDown, User, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const NAV = [
  {
    label: "Company",
    items: [
      { label: "About", page: "About" },
      { label: "Dream Team", page: "DreamTeam" },
      { label: "Partners", page: "Partners" },
      { label: "Master Covenant", page: "MasterCovenant" },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "QR Code Generator", page: "QRGenerator" },
      { label: "Blockchain Verification", page: "Blockchain" },
      { label: "Interactive Image Studio", page: "InteractiveImageStudio" },
      { label: "Steganography", page: "Steganography" },
      { label: "Hotzone Security Mapper", page: "HotzoneMapper" },
      { label: "NUPS POS System", page: "NUPSLogin" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { label: "GlyphBot Assistant", page: "GlyphBot" },
      { label: "Content Generator", page: "ContentGenerator" },
      { label: "Image Generator", page: "ImageGenerator" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Documentation", page: "SecurityDocs" },
      { label: "Roadmap", page: "Roadmap" },
      { label: "FAQ", page: "FAQ" },
    ],
  },
];

export default function Navbar({ user, onLogin, onLogout }) {
  const [open, setOpen] = useState(null);

  return (
    <nav className="w-full bg-gradient-to-r from-black via-ultraviolet/10 to-black border-b-4 border-ultraviolet shadow-[0_0_40px_rgba(138,43,226,0.8),0_10px_60px_rgba(0,234,255,0.4)] text-white font-medium z-50 sticky top-0 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-br from-ultraviolet to-cyan rounded-xl shadow-[0_0_20px_rgba(0,234,255,0.6)] group-hover:shadow-[0_0_30px_rgba(138,43,226,0.8)] transition-all duration-300">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
              alt="GlyphLock"
              className="h-8 w-auto"
            />
          </div>
          <span className="text-transparent bg-gradient-to-r from-ultraviolet via-cyan to-ultraviolet bg-clip-text font-black text-2xl tracking-wide group-hover:scale-105 transition-transform">
            GlyphLock
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {NAV.map((section) => (
            <div 
              key={section.label} 
              className="relative pt-2"
              onMouseEnter={() => setOpen(section.label)}
              onMouseLeave={() => setOpen(null)}
            >
              <button
                className="flex items-center gap-1 text-white hover:text-cyan transition-all duration-300 -mt-2 font-bold hover:scale-110"
              >
                {section.label}
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>

              {open === section.label && (
                <div
                  className="absolute left-0 top-full bg-gradient-to-br from-ultraviolet/40 via-black/90 to-cyan/40 border-4 border-cyan rounded-xl shadow-[0_0_40px_rgba(0,234,255,0.6)] p-4 w-64 z-50 backdrop-blur-xl"
                >
                  {section.items.map((item) => (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      className="block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-ultraviolet/30 hover:to-cyan/30 hover:text-white transition-all duration-300 text-gray-100 font-semibold border border-transparent hover:border-cyan/50 hover:shadow-[0_0_15px_rgba(0,234,255,0.4)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link to={createPageUrl("Pricing")}>
            <button className="text-white hover:text-cyan transition-all duration-300 font-bold hover:scale-110">Pricing</button>
          </Link>

          <Link to={createPageUrl("Consultation")}>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-ultraviolet to-cyan text-white font-black shadow-[0_0_25px_rgba(138,43,226,0.8)] hover:shadow-[0_0_40px_rgba(0,234,255,1)] hover:scale-105 transition-all duration-300 border-2 border-white/20">
              Contact
            </button>
          </Link>

          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan to-ultraviolet border-2 border-white/30 text-white hover:shadow-[0_0_30px_rgba(138,43,226,0.8)] font-bold hover:scale-105 transition-all duration-300">
                  <User className="w-5 h-5 mr-2" />
                  {user.full_name?.split(" ")[0] || "User"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gradient-to-br from-ultraviolet/40 via-black/90 to-cyan/40 border-4 border-cyan shadow-[0_0_40px_rgba(0,234,255,0.6)] backdrop-blur-xl">
                <DropdownMenuItem asChild className="text-white hover:bg-gradient-to-r hover:from-ultraviolet/30 hover:to-cyan/30 font-semibold">
                  <Link to={createPageUrl("Dashboard")}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyan/50" />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-red-400 hover:bg-red-500/30 font-semibold"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={onLogin}
              className="bg-gradient-to-r from-ultraviolet to-cyan border-2 border-white/30 text-white hover:shadow-[0_0_30px_rgba(0,234,255,0.8)] font-bold hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}