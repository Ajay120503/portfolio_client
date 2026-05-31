import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  PenTool,
  Smartphone,
  Palette,
  Globe,
  ShieldCheck,
  Rocket,
  Layers3,
  Zap,
  Users,
  Trophy,
  Clock,
  Wrench,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useServices, useSettings } from "../../hooks/usePortfolioData";
import { useTheme } from "../../hooks/useTheme";

const serviceIcons = {
  web: Globe,
  frontend: Palette,
  backend: Layers3,
  mobile: Smartphone,
  uiux: PenTool,
  fullstack: Code2,
  security: ShieldCheck,
  deployment: Rocket,
};

const STATS = [
  { label: "Projects Delivered", value: "50+", icon: Trophy },
  { label: "Happy Clients", value: "30+", icon: Users },
  { label: "Technologies", value: "20+", icon: Zap },
  { label: "Years Experience", value: "3+", icon: Clock },
];

/* ─── Section dot background ─────────────────────────────────────── */
const GridBackground = () => (
  <div
    className="absolute inset-0 overflow-hidden pointer-events-none"
    aria-hidden="true"
  >
    {/* Dot grid */}
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage:
          "radial-gradient(var(--color-primary) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  </div>
);

/* ─── Stat card ──────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay: 0.3 + index * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="public-card public-card-hover relative group overflow-hidden rounded-2xl p-5 flex items-center gap-4"
  >
    {/* Hover shimmer */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 6%, transparent), transparent 60%)",
      }}
    />
    <div
      className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      style={{
        background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
        color: "var(--color-primary)",
      }}
    >
      <Icon size={20} />
    </div>
    <div className="relative">
      <p
        className="text-xl sm:text-2xl md:text-3xl font-black leading-none"
        style={{ color: "var(--color-primary)" }}
      >
        {value}
      </p>
      <p className="text-xs text-base-content/50 mt-0.5 font-medium">{label}</p>
    </div>
  </motion.div>
);

/* ─── Service card ───────────────────────────────────────────────── */
const ServiceCard = ({ service, index }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = serviceIcons[service.category] || Code2;
  const features = service.features ?? [];
  const visibleFeatures = expanded ? features : features.slice(0, 4);
  const { data: settings } = useSettings();
  const { theme } = useTheme(settings?.defaultTheme);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 + index * 0.07,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="public-card public-card-hover group relative flex flex-col rounded-3xl overflow-hidden h-full"
    >
      {/* Top accent bar */}
      <div
        className="h-0.75 w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-primary), transparent)",
        }}
      />

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col flex-1 p-6 md:p-8">
        {/* Icon + badge row */}
        <div className="flex items-start justify-between mb-5">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md shrink-0"
            style={{
              background:
                "color-mix(in srgb, var(--color-primary) 12%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--color-primary) 22%, transparent)",
              color: "var(--color-primary)",
            }}
          >
            {service.icon ? (
              <span className="text-3xl">{service.icon}</span>
            ) : (
              <Icon size={28} />
            )}
          </motion.div>

          {service.price && (
            <div className="text-right shrink-0 ml-3">
              <p className="text-[10px] uppercase tracking-widest text-base-content/40 font-semibold">
                From
              </p>
              <p
                className="text-xl font-black leading-tight"
                style={{ color: "var(--color-primary)" }}
              >
                {service.price}
              </p>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-3 group-hover:text-primary transition-colors duration-300 leading-snug">
          {service.title}
        </h2>

        {/* Description */}
        <p className="text-base-content/60 text-sm leading-relaxed mb-5">
          {service.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-base-content/8 mb-5" />

        {/* Features */}
        <div className="flex-1 space-y-2.5 mb-5">
          <AnimatePresence initial={false}>
            {visibleFeatures.map((feature, fi) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2.5"
              >
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--color-primary)" }}
                />
                <span className="text-sm text-base-content/70">{feature}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {features.length > 4 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs font-semibold mt-1 transition-colors"
              style={{ color: "var(--color-primary)" }}
            >
              {expanded
                ? "Show less ↑"
                : `+${features.length - 4} more features`}
            </button>
          )}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white transition-shadow"
          style={{
            background: "var(--color-primary)",
            boxShadow:
              "0 6px 20px color-mix(in srgb, var(--color-primary) 28%, transparent)",
          }}
        >
          <span
            className={`flex space-x-1 justify-center items-center ${
              theme === "black" ? "text-black" : "text-white"
            }`}
          >
            Get Started
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ─── CTA Banner ─────────────────────────────────────────────────── */
const CTABanner = () => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="relative mt-16 sm:mt-20 md:mt-24 rounded-3xl overflow-hidden"
    style={{
      background:
        "linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, black))",
    }}
  >
    {/* Inner decoration circles */}
    {[140, 240, 340, 440].map((size, i) => (
      <div
        key={i}
        className="absolute rounded-full border border-white/10 pointer-events-none"
        style={{
          width: size,
          height: size,
          right: `-${size / 4}px`,
          top: `${-size / 3}px`,
        }}
      />
    ))}
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />

    <div className="relative z-10 px-8 py-14 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
      <div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3">
          Ready to Build
          <br className="hidden md:block" /> Something Amazing?
        </h2>
        <p className="text-white/70 text-sm sm:text-base max-w-xl leading-relaxed">
          Let&apos;s turn your ideas into powerful digital experiences with
          modern technologies and beautiful UI.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="shrink-0 flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white font-bold text-sm shadow-xl transition-shadow hover:shadow-2xl"
        style={{ color: "var(--color-primary)" }}
      >
        Start Your Project
        <ArrowRight size={16} />
      </motion.button>
    </div>
  </motion.div>
);

export const ServicesSection = ({ showHero = true, showCta = true }) => {
  const { data: services, isLoading } = useServices();
  return (
    <section
      id="services"
      className={`public-hero relative pt-10 px-4 pb-16 sm:pb-20 md:pb-24 sm:px-6 lg:px-8`}
    >
      {/* <GridBackground /> */}

      <div className="relative max-w-7xl mx-auto">
        {showHero && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8 sm:mb-10 md:mb-14"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
              <Wrench size={40} />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
              My{" "}
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Services
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-base-content/70 leading-relaxed">
              Modern, scalable, and visually stunning digital solutions that
              help businesses grow and stand out online.
            </p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span
              className="loading loading-spinner loading-lg"
              style={{ color: "var(--color-primary)" }}
            />
            <p className="text-base-content/40 text-sm">Loading services...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12 md:mb-14">
              {STATS.map((s, i) => (
                <StatCard key={s.label} {...s} index={i} />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-7">
              {services?.map((service, i) => (
                <ServiceCard key={service._id} service={service} index={i} />
              ))}
            </div>

            {showCta && <CTABanner />}
          </>
        )}
      </div>
    </section>
  );
};

/* ─── Page ───────────────────────────────────────────────────────── */
const Services = () => {
  const { data: settings } = useSettings();

  return (
    <HelmetProvider>
      <Helmet>
        <title>Services | {settings?.siteTitle || "Portfolio"}</title>
      </Helmet>

      <div className="public-page min-h-screen overflow-hidden">
        <Navbar />
        <ServicesSection />
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Services;
