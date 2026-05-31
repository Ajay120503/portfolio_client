import { motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  GraduationCap,
  Calendar,
  Award,
  Building2,
  BookOpen,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useEducation } from "../../hooks/usePortfolioData";
import { useSettings } from "../../hooks/usePortfolioData";

export const EducationSection = () => {
  const { data, isLoading } = useEducation();

  // Normalize data
  const education = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  if (isLoading) {
    return (
      <section id="education" className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="public-hero">
      {/* Background decoration */}
      {/* <div className="absolute inset-0 bg-linear-to-b from-base-100/55 via-base-200/20 to-base-100/55" /> */}

      <div className="container mx-auto px-4 relative z-10 mb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20 md:mb-28"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Education &{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Qualifications
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-base-content/70 leading-relaxed">
            My academic background, degrees, and continuous learning journey.
          </p>
        </motion.div>

        {/* Education Cards Grid */}
        {education.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
              <GraduationCap size={40} className="text-primary/60" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              No education entries yet
            </h3>
            <p className="text-base-content/60">
              Check back soon for my academic background.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {education.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6 }}
                className="group public-card relative bg-base-100/80 backdrop-blur-sm rounded-3xl p-6 md:p-7"
              >
                {/* Decorative shine */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex gap-5">
                  {/* Logo / Icon */}
                  <div className="shrink-0">
                    {item.logo?.url ? (
                      <img
                        src={item.logo.url}
                        alt={item.institution}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-base-300 shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                        <Building2 size={32} className="text-primary/60" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-xl md:text-2xl font-bold leading-tight">
                        {item.institution}
                      </h3>
                      {item.isCurrent && (
                        <span className="badge badge-success badge-sm">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-semibold text-base mb-2">
                      {item.degree}
                      {item.field && ` in ${item.field}`}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>
                          {item.startYear} —{" "}
                          {item.isCurrent
                            ? "Present"
                            : item.endYear || "Present"}
                        </span>
                      </div>
                      {item.grade && (
                        <div className="flex items-center gap-1.5">
                          <Award size={14} />
                          <span>{item.grade}</span>
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <div
                        className="prose prose-sm max-w-none text-base-content/70 mt-3 leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Education = () => {
  const { data: settings } = useSettings();

  return (
    <HelmetProvider>
      <Helmet>
        <title>Education | {settings?.siteTitle || "Portfolio"}</title>
        <meta
          name="description"
          content="My academic background, degrees, and qualifications"
        />
      </Helmet>

      <div className="public-page min-h-screen text-base-content">
        <Navbar />
        <main className="pt-20">
          <EducationSection />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Education;
