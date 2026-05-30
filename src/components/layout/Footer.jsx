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
} from "lucide-react";
import { motion } from "framer-motion";
import { useSettings, useProfile } from "../../hooks/usePortfolioData";

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

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  const socialLinks = profile?.socialLinks
    ? Object.entries(profile.socialLinks).filter(([, url]) => url)
    : [];

  return (
    <footer className="relative overflow-hidden border-t border-base-300 bg-base-200/60 backdrop-blur-xl">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg,var(--color-primary),#7c3aed)",
                }}
              >
                <Code2 size={24} className="text-white" />
              </motion.div>

              <div>
                <h2 className="text-xl font-black gradient-text leading-tight">
                  {settings?.siteTitle?.split("|")[0]?.trim() || "Portfolio"}
                </h2>
                <p className="text-xs text-base-content/50">
                  Developer Portfolio
                </p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-base-content/60 max-w-sm">
              {settings?.siteDescription ||
                "Building modern, scalable, and beautiful digital experiences with creativity and performance in mind."}
            </p>

            {/* Social */}
            <div className="flex flex-wrap gap-3 pt-2">
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
                    whileHover={{
                      y: -4,
                      scale: 1.08,
                    }}
                    transition={{
                      delay: i * 0.05,
                    }}
                    className="btn btn-circle btn-sm public-card bg-base-100/70 backdrop-blur-md hover:border-primary hover:bg-primary hover:text-white shadow-md"
                  >
                    <Icon size={17} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-5 flex items-center gap-2">
              <Link2 size={16} className="text-primary" />
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">
              {[...(settings?.navLinks || [])]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .slice(0, 10)
                .map((link) => {
                  // const isHash = link?.href?.startsWith("/");

                  // if (isHash) {
                  //   return (
                  //     <a
                  //       key={link.label}
                  //       href={link.href}
                  //       className="group text-sm text-base-content/60 hover:text-primary transition-all duration-300 w-fit flex items-center gap-2"
                  //     >
                  //       <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-all"></span>
                  //       {link.label}
                  //     </a>
                  //   );
                  // }

                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="group text-sm text-base-content/60 hover:text-primary transition-all duration-300 w-fit flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-all"></span>
                      {link.label}
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-5">Let’s Connect</h3>

            <div className="space-y-4">
              {profile?.email && (
                <div className="glass-card p-4 rounded-2xl bg-base-100/40 border border-base-300/40">
                  <p className="text-xs text-base-content/40 mb-1">Email</p>
                  <p className="text-sm font-medium break-all">
                    {profile.email}
                  </p>
                </div>
              )}

              {profile?.location && (
                <div className="glass-card p-4 rounded-2xl bg-base-100/40 border border-base-300/40">
                  <p className="text-xs text-base-content/40 mb-1">Location</p>
                  <p className="text-sm font-medium">{profile.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-bold text-lg mb-5">Need a Developer?</h3>

            <div className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 to-secondary/10 p-6 shadow-xl">
              <p className="text-sm text-base-content/70 leading-relaxed mb-5">
                I’m available for freelance projects, collaborations, and
                full-stack development work.
              </p>

              <Link
                to="/contact"
                className="btn btn-primary rounded-2xl w-full shadow-lg"
                style={{
                  background: "var(--color-primary)",
                  border: "none",
                }}
              >
                Let&apos;s Talk
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 sm:mt-12 md:mt-14 pt-6 border-t border-base-300/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-base-content/50 text-center flex items-center gap-1">
            {settings?.footerText || (
              <>
                © {new Date().getFullYear()} Built with
                <Heart size={14} className="text-red-500 fill-red-500" />
                by{" "}
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
            className="btn btn-sm rounded-2xl border border-base-300 bg-base-100/70 backdrop-blur-md hover:border-primary hover:text-primary gap-2"
          >
            <ArrowUp size={16} />
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
