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
    <section className="public-hero relative flex min-h-screen items-start justify-center overflow-hidden px-4 pt-10 pb-10 sm:px-6 lg:px-8">
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
          >
            <div className="mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 sm:px-4 py-1 text-sm font-semibold text-primary backdrop-blur-sm">
                <Code2 size={14} />
                Web Developer Portfolio
              </span>
            </div>

            {profile?.isAvailableForWork && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-success backdrop-blur-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
                </span>
                {profile.availabilityText || "Available for work"}
              </motion.div>
            )}

            <h1 className="public-title mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              Designing and building as{" "}
              <span className="rotating-name inline-grid align-bottom overflow-hidden">
                <span className="public-gradient-text bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {profile?.fullName || "Developer"}
                </span>
                <span className="public-gradient-text bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {profile?.tagline || "Creator"}
                </span>
              </span>
              {/* <span className="text-rotate text-7xl inline-grid align-bottom overflow-hidden">
                <span className="justify-items-start">
                  <span className="public-gradient-text bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    {profile?.fullName || "Developer"}
                  </span>
                  <span className="public-gradient-text bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    {profile?.tagline || "Creator"}
                  </span>
                  <span>DEPLOY</span>
                  <span>SCALE</span>
                  <span>MAINTAIN</span>
                  <span>REPEAT</span>
                </span>
              </span> */}
            </h1>

            {/* <h2 className="mb-3 text-sm sm:text-base md:text-lg font-semibold text-base-content/80">
              {profile?.tagline || "Full Stack Developer"}
            </h2> */}

            <p className="mb-5 max-w-2xl text-sm text-base-content/70 leading-relaxed">
              {profile?.subTagline ||
                "Building amazing digital experiences that blend creativity with performance."}
            </p>

            <div className="mb-4 sm:mb-5 flex flex-wrap gap-2 sm:gap-3">
              <Link
                to="/contact"
                className="group btn btn-primary gap-2 rounded-2xl border-none px-5 sm:px-6 shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                {profile?.ctaButtonText || "Hire Me"}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline gap-2 rounded-2xl px-5 sm:px-6 backdrop-blur-sm transition-all hover:scale-105"
                >
                  <Download size={16} />
                  Download CV
                </a>
              )}
            </div>

            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map(([platform, url]) => {
                const Icon = socialIcons[platform];
                if (!Icon) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm btn-circle public-card bg-base-100/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                    aria-label={`Visit my ${platform} profile`}
                    title={platform}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column - Improved Image Frame */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="flex justify-center"
          >
            <div className="relative group">
              {/* Orbiting decorative rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-full border border-dashed border-primary/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-full border border-dotted border-secondary/25"
              />
              {/* Main image container with glass effect */}
              <div className="public-image-frame relative h-56 w-56 overflow-hidden rounded-full border-3 border-primary/70 shadow-xl md:h-72 md:w-72 lg:h-80 lg:w-80">
                {profile?.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt={profile.fullName || "Profile"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 to-secondary/20">
                    <Code2 size={72} className="text-primary" />
                  </div>
                )}
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
            {/* <SkillsSection showHero={false} />
            <ExperienceSection />
            <ServicesSection showHero={false} showCta={false} /> */}
          </>
        )}
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Home;
