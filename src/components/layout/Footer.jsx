import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  ArrowUp,
  Code2,
  Heart,
  Link2,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSettings, useProfile } from "../../hooks/usePortfolioData";
import { useTheme } from "../../hooks/useTheme";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

const Footer = () => {
  const { data: settings } = useSettings();
  const { data: profile } = useProfile();
  const { theme } = useTheme(settings?.defaultTheme);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socialLinks = profile?.socialLinks
    ? Object.entries(profile.socialLinks).filter(([, url]) => url)
    : [];

  return (
    <footer className="relative overflow-hidden border-t border-base-300/60">
      {/* Background */}
      <div className="absolute inset-0 bg-base-200/40 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/3 to-primary/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-primary blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                <Code2
                  size={20}
                  style={{ color: theme === "black" ? "#000000" : "#ffffff" }}
                  className="relative z-10"
                />
              </motion.div>
              <div>
                <h2 className="text-lg font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
                  {settings?.siteTitle?.split("|")[0]?.trim() || "Portfolio"}
                </h2>
                <p className="text-xs text-base-content/40 tracking-widest uppercase">
                  Developer Portfolio
                </p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-base-content/55">
              {settings?.siteDescription ||
                "Building modern, scalable, and beautiful digital experiences with creativity and performance in mind."}
            </p>

            {/* Social */}
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.map(([platform, url], i) => {
                const Icon = socialIcons[platform];
                if (!Icon) return null;
                return (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={platform}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -3, scale: 1.1 }}
                    transition={{ delay: i * 0.05 }}
                    className="w-9 h-9 rounded-xl public-card bg-base-100/60 flex items-center justify-center text-base-content/60 hover:text-primary hover:border-primary/40 transition-all duration-200"
                  >
                    <Icon size={16} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="font-bold text-sm uppercase tracking-widest text-base-content/40 flex items-center gap-2">
              <Link2 size={14} className="text-primary" />
              Quick Links
            </h3>
            <div className="flex flex-col gap-2.5">
              {[...(settings?.navLinks || [])]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .slice(0, 6)
                .map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="group text-sm text-base-content/60 hover:text-primary transition-all duration-200 w-fit flex items-center gap-2.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-150 transition-all duration-200" />
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="font-bold text-sm uppercase tracking-widest text-base-content/40">
              Let's Connect
            </h3>
            <div className="space-y-3">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-3 p-3.5 rounded-2xl public-card bg-base-100/40 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/40 mb-0.5">Email</p>
                    <p className="text-sm font-medium break-all leading-tight">
                      {profile.email}
                    </p>
                  </div>
                </a>
              )}
              {profile?.location && (
                <div className="flex items-center gap-3 p-3.5 rounded-2xl public-card bg-base-100/40">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/40 mb-0.5">
                      Location
                    </p>
                    <p className="text-sm font-medium">{profile.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-5">
            <h3 className="font-bold text-sm uppercase tracking-widest text-base-content/40">
              Hire Me
            </h3>
            <div className="relative rounded-3xl border border-primary/20 bg-linear-to-br from-primary/8 to-secondary/8 p-5 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Available for work
                  </span>
                </div>
                <p className="text-sm text-base-content/65 leading-relaxed mb-4">
                  Open to freelance projects, collaborations, and full-stack
                  development opportunities.
                </p>
                <Link
                  to="/contact"
                  className="btn btn-primary rounded-2xl w-full border-none shadow-md text-sm font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                    color: theme === "black" ? "#000000" : "#ffffff",
                  }}
                >
                  Let's Talk
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-base-300/80 to-transparent mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-base-content/40 text-center flex items-center gap-1.5 flex-wrap justify-center">
            {settings?.footerText || (
              <>
                © {new Date().getFullYear()} Built with
                <Heart size={13} className="text-red-500 fill-red-500" />
                by
                <span className="font-semibold text-primary">
                  {profile?.fullName || "Developer"}
                </span>
              </>
            )}
          </p>

          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="btn btn-sm rounded-2xl public-card bg-base-100/60 hover:border-primary/40 hover:text-primary gap-2 text-base-content/50 border-base-300/60"
          >
            <ArrowUp size={15} />
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;