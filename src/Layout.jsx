import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SecurityMonitor from "@/components/SecurityMonitor";
import GlyphBotJr from "@/components/GlyphBotJr";
import InteractiveNebula from "@/components/InteractiveNebula";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const isAuthenticated = await base44.auth.isAuthenticated();
        if (isAuthenticated) {
          const userData = await base44.auth.me();
          setUser(userData);
        }
      } catch (err) {
        console.error("Failed to get user:", err);
      }
    })();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleLogin = async () => {
    try {
      await base44.auth.redirectToLogin();
    } catch (err) {
      console.error("Login redirect failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col">
      <SecurityMonitor />
      <InteractiveNebula />

      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                {canGoBack && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="glass-royal border border-blue-500/30 text-white hover:text-blue-400 hover:bg-blue-500/30 h-10 w-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}

                <Link
                  to={createPageUrl("Home")}
                  className="flex items-center gap-3 group"
                >
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
                    alt="GlyphLock"
                    className="h-10 w-auto transform group-hover:scale-110 transition-transform mt-[2px] mr-[2px]"
                  />
                  <h1 className="text-xl font-bold text-white hidden sm:block">
                    GlyphLock
                  </h1>
                </Link>
              </div>

              {/* DESKTOP NAV */}
              <div className="hidden lg:flex items-center gap-2">
                {/* HOME */}
                <Link to={createPageUrl("Home")}>
                  <Button
                    className={
                      isActive("Home")
                        ? "bg-blue-500/30 border-none text-blue-400 text-sm h-10 px-4"
                        : "bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-10 px-4"
                    }
                  >
                    Home
                  </Button>
                </Link>

                {/* COMPANY MENU */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-10 px-4">
                      Company
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="glass-royal border-blue-500/50 bg-black/95 backdrop-blur-xl shadow-2xl"
                    align="start"
                  >
                    {navigationConfig.main
                      .find((item) => item.label === "Company")
                      ?.dropdown.map((subItem) => (
                        <DropdownMenuItem
                          key={subItem.page}
                          asChild
                          className="text-white hover:text-blue-400 hover:bg-blue-500/30 text-sm"
                        >
                          <Link to={createPageUrl(subItem.page)}>
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* SECURITY MENU */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-10 px-4">
                      Security
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="glass-royal border-blue-500/50 bg-black/95 backdrop-blur-xl shadow-2xl"
                    align="start"
                  >
                    {navigationConfig.main
                      .find((item) => item.label === "Security")
                      ?.dropdown.map((subItem) => (
                        <DropdownMenuItem
                          key={subItem.page}
                          asChild
                          className="text-white hover:text-blue-400 hover:bg-blue-500/30 text-sm"
                        >
                          <Link to={createPageUrl(subItem.page)}>
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* AI LINK */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Link to={createPageUrl("GlyphBot")}>
                        <Button
                          className={
                            isActive("GlyphBot")
                              ? "bg-blue-500/30 border-none text-blue-400 text-sm h-10 px-4"
                              : "bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-10 px-4"
                          }
                        >
                          AI
                        </Button>
                      </Link>
                      <HelpCircle className="w-3 h-3 text-blue-400/70" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="glass-royal bg-black/90 border-blue-500/50 text-white">
                    GlyphBot — AI-powered cybersecurity assistant
                  </TooltipContent>
                </Tooltip>

                {/* PRICING */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Link to={createPageUrl("Pricing")}>
                        <Button
                          className={
                            isActive("Pricing")
                              ? "bg-blue-500/30 border-none text-blue-400 text-sm h-10 px-4"
                              : "bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-10 px-4"
                          }
                        >
                          Pricing
                        </Button>
                      </Link>
                      <HelpCircle className="w-3 h-3 text-blue-400/70" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="glass-royal bg-black/90 border-blue-500/50 text-white">
                    View pricing plans and packages
                  </TooltipContent>
                </Tooltip>

                {/* CONTACT */}
                {!isConsultationPage && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 ml-2">
                        <Link to={createPageUrl("Consultation")}>
                          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white glow-royal shadow-xl text-sm h-10 px-4">
                            Contact
                          </Button>
                        </Link>
                        <HelpCircle className="w-3 h-3 text-blue-400/70" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="glass-royal bg-black/90 border-blue-500/50 text-white">
                      Schedule a consultation with our experts
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* USER MENU */}
                {user ? (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button className="ml-2 glass-royal border border-blue-500/30 text-white hover:bg-blue-500/30 text-sm h-10 px-4">
                        <User className="w-4 h-4 mr-2" />
                        {user.full_name?.split(" ")[0] || "User"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="glass-royal border-blue-500/50 bg-black/95 shadow-2xl"
                      align="end"
                    >
                      <DropdownMenuItem asChild className="text-white hover:text-blue-400 hover:bg-blue-500/30 text-sm">
                        <Link to={createPageUrl("Dashboard")}>
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="text-white hover:text-blue-400 hover:bg-blue-500/30 text-sm">
                        <Link to={createPageUrl("ManageSubscription")}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Manage Subscription
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-blue-500/30" />

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 text-sm"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    onClick={handleLogin}
                    className="ml-2 glass-royal border border-blue-500/50 text-white hover:bg-blue-500/30 text-sm h-10 px-4"
                  >
                    Sign In
                  </Button>
                )}
              </div>

              {/* MOBILE MENU BUTTON */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white p-2 glass-royal border border-blue-500/30 rounded-lg h-10 w-10 flex items-center justify-center"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* MOBILE NAV DROPDOWN */}
            {mobileMenuOpen && (
              <div className="lg:hidden py-4 border-t border-blue-500/30 bg-black/95 backdrop-blur-xl max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <Link to={createPageUrl("Home")} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                      Home
                    </Button>
                  </Link>

                  {/* Company */}
                  <div className="px-3 py-2 text-xs font-semibold text-blue-400">Company</div>
                  {navigationConfig.main
                    .find((item) => item.label === "Company")
                    ?.dropdown.map((subItem) => (
                      <Link
                        key={subItem.page}
                        to={createPageUrl(subItem.page)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full justify-start pl-6 bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                          {subItem.label}
                        </Button>
                      </Link>
                    ))}

                  {/* Security */}
                  <div className="px-3 py-2 text-xs font-semibold text-blue-400 mt-2">Security</div>
                  {navigationConfig.main
                    .find((item) => item.label === "Security")
                    ?.dropdown.map((subItem) => (
                      <Link
                        key={subItem.page}
                        to={createPageUrl(subItem.page)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full justify-start pl-6 bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                          {subItem.label}
                        </Button>
                      </Link>
                    ))}

                  <Link to={createPageUrl("GlyphBot")} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11 mt-2">
                      GlyphBot AI
                    </Button>
                  </Link>

                  <Link to={createPageUrl("Pricing")} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                      Pricing
                    </Button>
                  </Link>

                  {user && (
                    <>
                      <Link to={createPageUrl("Dashboard")} onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                          Dashboard
                        </Button>
                      </Link>

                      <Link
                        to={createPageUrl("ManageSubscription")}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                          Manage Subscription
                        </Button>
                      </Link>
                    </>
                  )}

                  {!isConsultationPage && (
                    <Link
                      to={createPageUrl("Consultation")}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white mt-2 shadow-xl text-base h-11">
                        Contact Sales
                      </Button>
                    </Link>
                  )}

                  {user ? (
                    <Button
                      onClick={handleLogout}
                      className="w-full mt-2 glass-royal border border-red-500/50 text-red-400 hover:bg-red-500/20 text-base h-11"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Button
                      onClick={handleLogin}
                      className="w-full mt-2 glass-royal border border-blue-500/50 text-white hover:bg-blue-500/30 text-base h-11"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main className="min-h-screen pt-24 pb-8 relative z-10">{children}</main>

        <GlyphBotJr />

        {/* FOOTER */}
        <footer className="glass-royal border-t border-blue-500/50 py-12 relative z-10 shadow-2xl">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
                    alt="GlyphLock"
                    className="h-8 w-auto"
                  />
                </div>
                <p className="text-sm text-white/70">
                  Next-generation cybersecurity platform with quantum-resistant encryption and AI integration.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-white">Services</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {navigationConfig.footer.services.map((item) => (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      className="text-white/70 hover:text-blue-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-white">Company</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {navigationConfig.footer.company.map((item) => (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      className="text-white/70 hover:text-blue-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-white">Legal</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {navigationConfig.footer.legal.map((item) => (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      className="text-white/70 hover:text-blue-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-blue-500/30">
              <div className="mb-8">
                <h4 className="text-center text-sm font-semibold mb-6 text-white/70">
                  Security & Compliance
                </h4>

                <div className="flex flex-wrap items-center justify-center gap-6">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="glass-dark border-blue-500/30 rounded-lg p-4 w-24 h-24 flex flex-col items-center justify-center hover:border-blue-500/50 transition-all">
                      <Shield className="w-8 h-8 text-blue-400 mb-2" />
                      <div className="text-xs font-bold text-white text-center leading-tight">{cert.name}</div>
                      <div className="text-[10px] text-blue-400 mt-1">{cert.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                <div className="text-sm text-white/70">
                  <p>© 2025 GlyphLock Security LLC. All rights reserved.</p>
                </div>

                <div className="text-sm space-y-1 text-white/70">
                  <p>El Mirage, Arizona • Established January 2025</p>
                  <p>
                    <a
                      href="mailto:glyphlock@gmail.com"
                      className="hover:text-blue-400 transition-colors"
                    >
                      glyphlock@gmail.com
                    </a>
                    {" • "}
                    <a
                      href="tel:+14242466499"
                      className="hover:text-blue-400 transition-colors"
                    >
                      (424) 246-6499
                    </a>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </footer>
      </TooltipProvider>
    </div>
  );
}