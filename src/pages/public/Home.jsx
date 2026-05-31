import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Download,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import { HelmetProvider, Helmet } from "react-helmet-async";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useProfile, useSettings } from "../../hooks/usePortfolioData";
import { ExperienceSection } from "./Experience";
import { ServicesSection } from "./Services";
import { SkillsSection } from "./Skills";
import { TestimonialsSection } from "./TestimonialsSection";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

// --- Hero Skeleton Loader ---
const HeroSkeleton = () => (
  <section className="relative flex min-h-screen items-center justify-center px-4 pt-24 sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="skeleton h-8 w-48 rounded-full"></div>
          <div className="skeleton h-12 w-3/4 rounded-2xl"></div>
          <div className="skeleton h-6 w-1/2 rounded-xl"></div>
          <div className="skeleton h-20 w-full rounded-2xl"></div>
          <div className="flex gap-4">
            <div className="skeleton h-12 w-32 rounded-2xl"></div>
            <div className="skeleton h-12 w-32 rounded-2xl"></div>
          </div>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-10 w-10 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="skeleton h-64 w-64 rounded-full md:h-80 md:w-80"></div>
        </div>
      </div>
    </div>
  </section>
);

// --- Hero Section (Improved) ---
const HeroSection = ({ profile }) => {
  const socialLinks = profile?.socialLinks
    ? Object.entries(profile.socialLinks).filter(([, url]) => url)
    : [];
  // const ctaLink =
  //   !profile?.ctaButtonLink ||
  //   profile.ctaButtonLink === "#contact" ||
  //   profile.ctaButtonLink === "/#contact"
  //     ? "/contact"
  //     : profile.ctaButtonLink;

  return (
    <section className="public-hero relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-10 pb-10 sm:px-6 lg:px-8">
      {/* Enhanced background with animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,currentColor_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="absolute inset-0 mask-[radial-gradient(ellipse_at_center,black_0%,transparent_70%)]">
          <div className="absolute left-[12%] top-[22%] h-20 w-20 rotate-12 rounded-4xl border border-primary/20 backdrop-blur-sm" />
          <div className="absolute right-[16%] top-[18%] h-28 w-28 rounded-full border border-secondary/20 backdrop-blur-sm" />
          <div className="absolute bottom-[18%] left-[44%] h-16 w-16 -rotate-12 rounded-2xl border border-accent/20 backdrop-blur-sm" />
        </div>
        {/* <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-base-100 to-transparent" /> */}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-2">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-5"
          >
            {/* Top badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary tracking-wide uppercase">
                <Code2 size={13} />
                Web Developer Portfolio
              </span>

              {profile?.isAvailableForWork && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-xs font-bold text-success"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  {profile.availabilityText || "Available for work"}
                </motion.div>
              )}
            </div>

            {/* Heading */}
            <div>
              <h1 className="font-black leading-[1.05] tracking-tight">
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-base-content mb-2">
                  Designing &amp; building
                </span>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-base-content mb-3">
                  digital experiences
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  <span className="text-base-content/50 font-medium mr-3">
                    as
                  </span>
                  {/* Rotating text */}
                  <span
                    className="rotating-name inline-grid align-bottom overflow-hidden"
                    style={{ minWidth: "10ch" }}
                  >
                    <span className="public-gradient-text">
                      {profile?.fullName || "Developer"}
                    </span>
                    <span className="public-gradient-text">
                      {profile?.tagline || "Creator"}
                    </span>
                  </span>
                </span>
              </h1>
            </div>

            {/* Sub tagline */}
            <p className="max-w-lg text-base sm:text-lg text-base-content/60 leading-relaxed font-light">
              {profile?.subTagline ||
                "Building amazing digital experiences that blend creativity with performance."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="group btn btn-primary gap-2 rounded-2xl border-none px-6 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                }}
              >
                {profile?.ctaButtonText || "Hire Me"}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group btn btn-outline gap-2 rounded-2xl px-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-primary hover:text-primary hover:bg-primary/5"
                >
                  <Download size={16} />
                  Download CV
                </a>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-base-content/10" />
              <span className="text-xs text-base-content/30 uppercase tracking-widest">
                Find me on
              </span>
              <div className="h-px flex-1 bg-base-content/10" />
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map(([platform, url], i) => {
                const Icon = socialIcons[platform];
                if (!Icon) return null;
                return (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="w-10 h-10 rounded-xl public-card bg-base-100/50 backdrop-blur-sm flex items-center justify-center text-base-content/50 hover:text-primary hover:border-primary/40 transition-colors duration-200"
                    aria-label={`Visit my ${platform} profile`}
                    title={platform}
                  >
                    <Icon size={17} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="flex justify-center items-center"
          >
            <div className="relative group">
              {/* Outer slow rotate ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full border border-dashed border-primary/25"
              />

              {/* Inner counter rotate ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 rounded-full border border-dotted border-secondary/20"
              />

              {/* Glow blob behind image */}
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-110 opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Floating badge — top right */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-3 -right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full public-card bg-base-100/90 border border-primary/30 shadow-lg text-xs font-bold text-primary max-w-35"
              >
                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-primary animate-pulse" />
                <span className="truncate">
                  {profile?.availabilityText || "Available"}
                </span>
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-3 -left-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full public-card bg-base-100/90 border border-secondary/30 shadow-lg text-xs font-bold text-secondary max-w-35"
              >
                <Code2 size={12} className="shrink-0" />
                <span className="truncate">
                  {profile?.tagline || "Full Stack"}
                </span>
              </motion.div>

              {/* Main image */}
              <div className="relative h-56 w-56 md:h-72 md:w-72 lg:h-80 lg:w-80 rounded-full overflow-hidden border-2 border-primary/40 shadow-2xl z-10">
                {/* Corner accent dots */}
                <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-primary z-20 shadow-md shadow-primary/50" />
                <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-secondary z-20 shadow-md shadow-secondary/50" />

                {profile?.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt={profile.fullName || "Profile"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 to-secondary/20">
                    <Code2 size={72} className="text-primary" />
                  </div>
                )}

                {/* Overlay shimmer on hover */}
                <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Main Home Component ---
const Home = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: settings } = useSettings();

  // Apply theme color and smooth scroll
  useEffect(() => {
    if (settings?.themeColor) {
      document.documentElement.style.setProperty(
        "--color-primary",
        settings.themeColor
      );
    }
    // Smooth scroll for anchor links
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, [settings?.themeColor]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>
          {settings?.seoMeta?.title || settings?.siteTitle || "Portfolio"}
        </title>
        <meta
          name="description"
          content={
            settings?.seoMeta?.description ||
            settings?.siteDescription ||
            "Portfolio website"
          }
        />
        <meta name="theme-color" content={settings?.themeColor || "#3b82f6"} />
      </Helmet>

      <div className="public-page min-h-screen text-base-content overflow-x-hidden">
        <Navbar />
        {profileLoading ? (
          <HeroSkeleton />
        ) : (
          <>
            <HeroSection profile={profile} />
            <ExperienceSection />
            <SkillsSection showHero={true} />
            {/* <ServicesSection showHero={false} showCta={false} /> */}
            <TestimonialsSection />
          </>
        )}
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Home;
