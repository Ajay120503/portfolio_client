// src/pages/public/Experience.jsx

import { motion } from "framer-motion";
import { Briefcase, MapPin, CalendarDays, Building2 } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useExperience } from "../../hooks/usePortfolioData";
import { useSettings } from "../../hooks/usePortfolioData";

export const ExperienceSection = () => {
  const { data, isLoading } = useExperience();

  // FIX
  const experiences = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  if (isLoading) {
    return (
      <section id="experience" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="public-hero relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 mb-20">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
            <Briefcase size={40} />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Work{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Experience
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-base-content/70 leading-relaxed">
            A timeline of my professional growth, projects, and technical
            experience.
          </p>
        </motion.div>

        {/* TIMELINE */}
        <div className="relative max-w-5xl mx-auto">
          {/* CENTER LINE */}
          <div className="absolute left-5 md:left-1/2 top-0 w-0.5 h-full bg-primary/20"></div>

          <div className="space-y-10 sm:space-y-12 md:space-y-14">
            {experiences.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* DOT */}
                <div className="absolute left-5 md:left-1/2 top-6 -translate-x-1/2 z-10">
                  <div className="w-5 h-5 rounded-full bg-primary border-4 border-base-100 shadow-lg"></div>
                </div>

                {/* CARD */}
                <div className="md:w-1/2 ml-14 md:ml-0">
                  <div className="public-card public-card-hover rounded-3xl p-5 sm:p-6 md:p-7">
                    {/* TOP */}
                    <div className="flex items-start gap-4">
                      {/* LOGO */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-base-300 flex items-center justify-center shrink-0">
                        {item.companyLogo?.url ? (
                          <img
                            src={item.companyLogo.url}
                            alt={item.company}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2
                            size={28}
                            className="text-base-content/40"
                          />
                        )}
                      </div>

                      {/* INFO */}
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                          {item.role}
                        </h3>

                        <p className="text-primary font-semibold">
                          {item.company}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-base-content/60 mt-2">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {item.location || "Remote"}
                          </div>

                          <div className="flex items-center gap-1">
                            <CalendarDays size={14} />

                            {new Date(item.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )}

                            {" - "}

                            {item.isCurrent
                              ? "Present"
                              : item.endDate
                              ? new Date(item.endDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Present"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    {item.description && (
                      <div
                        className="prose prose-sm max-w-none mt-5 text-base-content/70"
                        dangerouslySetInnerHTML={{
                          __html: item.description,
                        }}
                      />
                    )}

                    {/* TECH STACK */}
                    {item.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-5">
                        {item.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="badge badge-primary badge-outline px-3 py-3 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* EMPTY HALF */}
                <div className="hidden md:block md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
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
        <main className="pt-10">
          <ExperienceSection />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Experience;
