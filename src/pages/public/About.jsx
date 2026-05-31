import { motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  User,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Award,
  Heart,
  Download,
  Trophy,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useAbout, useSettings } from "../../hooks/usePortfolioData";

const detailIcons = {
  Name: User,
  Email: Mail,
  Location: MapPin,
  Education: GraduationCap,
  Experience: Briefcase,
  "Years of Experience": Calendar,
  "Happy Clients": Heart,
  Awards: Award,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" },
  }),
};

const About = () => {
  const { data: about, isLoading } = useAbout();
  const { data: settings } = useSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>About | {settings?.siteTitle || "Portfolio"}</title>
        <meta
          name="description"
          content={about?.subheading || "Learn more about me and my work"}
        />
      </Helmet>

      <div className="public-page min-h-screen overflow-hidden">
        <Navbar />

        {/* ───────────── HERO ───────────── */}
        <section className="relative pt-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-16 items-center">
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="lg:col-span-2 flex justify-center"
              >
                <div className="relative group">
                  {/* Rotating gradient ring */}
                  <div
                    className="absolute -inset-4 rounded-full opacity-70 blur-md group-hover:opacity-100 transition duration-500"
                    style={{
                      background:
                        "conic-gradient(from 0deg, var(--color-primary), var(--color-secondary), var(--color-accent), var(--color-primary))",
                      animation: "spin 8s linear infinite",
                    }}
                  />
                  <div className="relative bg-base-100 p-1.5 rounded-full shadow-2xl">
                    <div className="rounded-full overflow-hidden w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 ring-1 ring-base-300/40">
                      {about?.profileImage?.url ? (
                        <img
                          src={about.profileImage.url}
                          alt={about?.fullName || "Profile"}
                          loading="lazy"
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <User size={80} className="text-primary/60" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-base-100 public-card shadow-lg rounded-full px-4 py-2 text-xs font-semibold"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                    </span>
                    Available for work
                  </motion.div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  show: { transition: { staggerChildren: 0.08 } },
                }}
                className="lg:col-span-3 space-y-4 sm:space-y-6"
              >
                {/* <motion.div variants={fadeUp}>
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
                    <User size={40} />
                  </div>
                </motion.div> */}

                <motion.h1
                  variants={fadeUp}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight"
                >
                  <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    {about?.heading || "Creative Developer"}
                  </span>
                </motion.h1>

                {about?.subheading && (
                  <motion.p
                    variants={fadeUp}
                    className="text-sm sm:text-base md:text-lg text-base-content/75 leading-relaxed max-w-2xl"
                  >
                    {about.subheading}
                  </motion.p>
                )}

                {about?.bio && (
                  <motion.div
                    variants={fadeUp}
                    className="relative bg-base-200/50 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-primary shadow-sm"
                  >
                    <div
                      className="prose prose-sm sm:prose-base max-w-none prose-p:text-base-content/80 prose-headings:text-base-content"
                      dangerouslySetInnerHTML={{ __html: about.bio }}
                    />
                  </motion.div>
                )}

                <motion.div
                  variants={fadeUp}
                  className="flex flex-wrap gap-3 pt-2"
                >
                  <button className="btn btn-primary rounded-xl px-6 gap-2 shadow-lg hover:shadow-primary/30 hover:scale-[1.03] transition-all duration-300">
                    <Download size={18} />
                    Download CV
                  </button>
                  <a
                    href="/contact"
                    className="btn btn-ghost rounded-xl px-6 gap-2 border border-base-300 hover:border-primary hover:bg-primary/10 hover:scale-[1.03] transition-all duration-300"
                  >
                    Get in touch
                  </a>
                </motion.div>
              </motion.div>
            </div>

            {/* ───────────── PERSONAL DETAILS ───────────── */}
            {about?.personalDetails?.length > 0 && (
              <motion.div
                className="mt-16 sm:mt-20 md:mt-28"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-6 sm:mb-8 md:mb-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                    <User size={28} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5">
                    <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      Personal Details
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {about.personalDetails.map((detail, i) => {
                    const Icon = detailIcons[detail.key] || User;
                    return (
                      <motion.div
                        key={i}
                        custom={i}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        whileHover={{ y: -4 }}
                        className="group relative bg-base-100/80 backdrop-blur-sm public-card rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                        <div className="relative flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 text-primary shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Icon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs uppercase tracking-wider text-base-content/50 font-semibold mb-1">
                              {detail.key}
                            </p>
                            <h3 className="text-base font-semibold wrap-break-word text-base-content">
                              {detail.value}
                            </h3>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ───────────── ACHIEVEMENTS ───────────── */}
            {about?.highlights?.length > 0 && (
              <motion.div
                className="mt-16 sm:mt-20 md:mt-28 mb-8 sm:mb-10 md:mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-6 sm:mb-8 md:mb-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                    <Trophy size={28} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5">
                    <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      Achievements
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {about.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      className="group relative bg-linear-to-br from-base-100 to-base-200/80 backdrop-blur-sm public-card rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 overflow-hidden"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="text-4xl mb-3 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                          {h.icon || <Trophy size={28} />}
                        </div>
                        <div className="text-3xl md:text-4xl font-extrabold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                          {h.value}
                        </div>
                        <div className="text-xs md:text-sm text-base-content/70 font-medium uppercase tracking-wider">
                          {h.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default About;
