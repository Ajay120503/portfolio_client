import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  CalendarDays,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useExperience, useSettings } from "../../hooks/usePortfolioData";

const ExperienceCard = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);
  const isEven = index % 2 === 0;

  const startDate = new Date(item.startDate).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const endDate = item.isCurrent
    ? "Present"
    : item.endDate
    ? new Date(item.endDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Present";

  // Calculate duration
  const start = new Date(item.startDate);
  const end = item.isCurrent
    ? new Date()
    : item.endDate
    ? new Date(item.endDate)
    : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const duration =
    years > 0
      ? `${years}y ${remMonths > 0 ? remMonths + "m" : ""}`
      : `${remMonths}m`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true, margin: "-50px" }}
      // className={`relative flex flex-col md:flex-row gap-0 ${
      //   isEven ? "md:flex-row" : "md:flex-row-reverse"
      // }`}
      className={`relative flex flex-col md:flex-row gap-0 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* DOT + line connector */}
      <div className="absolute left-5 md:left-1/2 top-7 -translate-x-1/2 z-20 flex flex-col items-center">
        {/* <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: index * 0.08 + 0.2, type: "spring" }}
          viewport={{ once: true }}
          className="w-5 h-5 rounded-full bg-primary border-4 border-base-100 shadow-lg shadow-primary/30"
        /> */}
        {/* DOT — hidden on mobile */}
        <div className="hidden md:flex absolute md:left-1/2 top-7 -translate-x-1/2 z-20 flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: index * 0.08 + 0.2, type: "spring" }}
            viewport={{ once: true }}
            className="w-5 h-5 rounded-full bg-primary border-4 border-base-100 shadow-lg shadow-primary/30"
          />
        </div>
      </div>

      {/* CARD */}
      {/* <div
        className={`md:w-1/2 ml-14 md:ml-0 ${isEven ? "md:pr-10" : "md:pl-10"}`}
      > */}
      <div className={`md:w-1/2 md:ml-0 ${isEven ? "md:pr-10" : "md:pl-10"}`}>
        <div className="public-card rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20">
          {/* Top color bar */}
          <div className="h-1 w-full bg-linear-to-r from-primary to-secondary" />

          <div className="p-5 sm:p-6">
            {/* Header row */}
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-base-200 flex items-center justify-center shrink-0 border border-base-300">
                {item.companyLogo?.url ? (
                  <img
                    src={item.companyLogo.url}
                    alt={item.company}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 size={24} className="text-base-content/30" />
                )}
              </div>

              {/* Title block */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold leading-tight">
                    {item.role}
                  </h3>
                  {item.isCurrent && (
                    <span className="badge badge-success badge-sm shrink-0 gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                      Current
                    </span>
                  )}
                </div>

                <p className="text-primary font-semibold text-sm mt-0.5">
                  {item.company}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-3 text-xs text-base-content/50 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {item.location || "Remote"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={11} />
                    {startDate} — {endDate}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    {duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Tech stack — always visible */}
            {item.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {item.technologies
                  .slice(0, expanded ? undefined : 5)
                  .map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/8 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                {!expanded && item.technologies.length > 5 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-base-200 text-base-content/50">
                    +{item.technologies.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Description — collapsible */}
            {item.description && (
              <>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="prose prose-sm max-w-none mt-4 text-base-content/65 leading-relaxed border-t border-base-200 pt-4"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand toggle */}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary/70 hover:text-primary transition-colors"
                >
                  {expanded ? (
                    <>
                      <ChevronUp size={14} /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} /> Read more
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Empty half for alternating layout */}
      <div className="hidden md:block md:w-1/2" />
    </motion.div>
  );
};

export const ExperienceSection = () => {
  const { data, isLoading } = useExperience();

  const experiences = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  if (isLoading) {
    return (
      <section id="experience" className="py-20">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="public-hero relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 mb-20 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
            <Briefcase size={40} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Work{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Experience
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-base-content/60 leading-relaxed">
            A timeline of my professional journey, roles, and technical
            contributions.
          </p>
        </motion.div>

        {experiences.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Briefcase size={36} className="text-primary/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No experience added yet</h3>
            <p className="text-base-content/50">Check back soon.</p>
          </div>
        ) : (
          <div className="relative max-w-5xl mx-auto">
            {/* Timeline center line */}
            {/* <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary/30 via-primary/15 to-transparent -translate-x-1/2" /> */}
            {/* Timeline center line — hidden on mobile */}
            <div className="hidden md:block absolute md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary/30 via-primary/15 to-transparent -translate-x-1/2" />
            <div className="space-y-10 sm:space-y-12">
              {experiences.map((item, index) => (
                <ExperienceCard key={item._id} item={item} index={index} />
              ))}
            </div>

            {/* Timeline end dot */}
            {/* <div className="absolute left-5 md:left-1/2 bottom-0 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-primary/30 bg-base-100" /> */}
            {/* Timeline end dot — hidden on mobile */}
            <div className="hidden md:block absolute md:left-1/2 bottom-0 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-primary/30 bg-base-100" />
          </div>
        )}
      </div>
    </section>
  );
};

const Experience = () => {
  const { data: settings } = useSettings();
  return (
    <HelmetProvider>
      <Helmet>
        <title>Experience | {settings?.siteTitle || "Portfolio"}</title>
      </Helmet>
      <div className="public-page min-h-screen text-base-content">
        <Navbar />
        <main>
          <ExperienceSection />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Experience;
