import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Code2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useProfile, useSettings } from "../../hooks/usePortfolioData";
import { useTheme } from "../../hooks/useTheme";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: settings } = useSettings();
  const { data: profile } = useProfile();
  const { theme, toggleTheme } = useTheme(settings?.defaultTheme);
  const location = useLocation();

  const brandName =
    profile?.fullName ||
    settings?.siteTitle?.split("|")[0]?.trim() ||
    "Portfolio";
  const brandTagline = profile?.tagline || "Developer Portfolio";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const defaultNavLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Skills", href: "/skills" },
    { label: "Experience", href: "/experience" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
  ];

  // const hiddenNavHrefs = new Set([
  //   "/about",
  //   "about",
  //   "/#about",
  //   "#about",
  //   "/contact",
  //   "contact",
  //   "/#contact",
  //   "#contact",
  // ]);
  // const hiddenNavLabels = new Set(["about", "contact"]);

  const navLinks =
    settings?.navLinks?.length > 0
      ? [...settings.navLinks]
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((link) => ({ ...link, href: link.href || link.path || "/" }))
      : // .filter(
        //   (link) =>
        //     !hiddenNavHrefs.has(link.href) &&
        //     !hiddenNavLabels.has(link.label?.toLowerCase())
        // )
        defaultNavLinks;

  const getIsActive = (href) => {
    if (!href || href.startsWith("#") || href.startsWith("/#")) {
      return (
        location.pathname === "/" && location.hash === href.replace("/", "")
      );
    }
    if (href === "/") return location.pathname === "/";
    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    );
  };

  const handleNavClick = () => setMobileOpen(false);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const timeoutId = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => clearTimeout(timeoutId);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`relative flex items-center justify-between rounded-2xl transition-all duration-300 ${
              isScrolled
                ? "bg-base-100/85 backdrop-blur-xl public-card shadow-lg px-4 h-14"
                : "bg-base-100/70 backdrop-blur-md public-card shadow-md px-4 h-16"
            }`}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            {/* Logo */}
            <Link
              to="/"
              className="relative flex items-center gap-3 group z-10"
            >
              <motion.div
                whileHover={{ rotate: 6, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary blur-md rounded-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                <div
                  className="relative w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                  }}
                >
                  <Code2 size={20} className="text-white" />
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <h2 className="font-black text-base leading-tight">
                  <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    {brandName}
                  </span>
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-base-content/50 mt-0.5 max-w-45 truncate">
                  {brandTagline}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 relative z-10 rounded-xl public-card bg-base-200/30 p-1">
              {navLinks.map((link) => {
                const isActive = getIsActive(link.href);
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={handleNavClick}
                    className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-base-content/70 hover:text-base-content hover:bg-base-100/50"
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {isActive && (
                        <span className="w-1 h-1 rounded-full bg-primary" />
                      )}
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="relative flex items-center gap-2 z-10">
              {/* Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={toggleTheme}
                className="btn btn-sm btn-circle rounded-xl public-card bg-base-100/50 backdrop-blur-sm text-base-content/70 hover:bg-primary/10 hover:text-primary hover:public-card transition-all"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Admin Button (Desktop) */}
              <Link
                to="/admin"
                className="hidden md:flex btn btn-primary rounded-xl border-none px-4 gap-1.5 shadow-md hover:shadow-lg transition-all group"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                }}
              >
                <ShieldCheck size={14} />
                <span className="text-sm font-medium">Admin</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="btn btn-sm btn-circle rounded-xl public-card bg-base-100/50 backdrop-blur-sm lg:hidden"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mobileOpen ? "close" : "menu"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            />
            <div className="fixed inset-x-0 top-20 z-50 flex justify-center px-4 lg:hidden">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-sm"
              >
                <div className="bg-base-100/95 backdrop-blur-2xl public-card rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-5 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                      }}
                    >
                      <Code2 size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-black text-base">{brandName}</h2>
                      <p className="text-xs text-base-content/50">
                        {brandTagline}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {navLinks.map((link, i) => {
                      const isActive = getIsActive(link.href);
                      return (
                        <motion.div
                          key={link.label}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <Link
                            to={link.href}
                            onClick={handleNavClick}
                            className={`flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-200 ${
                              isActive
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "bg-base-200/50 text-base-content/80 hover:bg-primary/5 hover:text-primary"
                            }`}
                          >
                            <span className="font-medium">{link.label}</span>
                            <ArrowRight size={15} />
                          </Link>
                        </motion.div>
                      );
                    })}
                    <motion.div
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.04 }}
                      className="pt-3"
                    >
                      <Link
                        to="/admin"
                        onClick={handleNavClick}
                        className="btn btn-primary w-full border rounded-xl gap-2 shadow-md"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                        }}
                      >
                        <ShieldCheck size={16} />
                        Admin Panel
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
