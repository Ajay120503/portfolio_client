// Skills.jsx — drop-in replacement for your portfolio's Skills page.
// Requires: npm i react-simple-maps d3-geo
// Keeps your existing hooks, layout, DaisyUI tokens, framer-motion and Helmet.

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Code2 } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useSettings, useSkills } from "../../hooks/usePortfolioData";

// Public world atlas (countries) — uses UN M49 numeric codes as geo.id.
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const REGIONS = {
  "North America": {},
  "South America": {},
  Europe: {},
  Africa: {},
  Asia: {},
  Oceania: {},
};

// UN M49 numeric country code -> continent. Matches world-atlas geo.id.
const COUNTRY_TO_REGION = {
  // North America
  840: "North America",
  124: "North America",
  484: "North America",
  320: "North America",
  "084": "North America",
  222: "North America",
  340: "North America",
  558: "North America",
  188: "North America",
  591: "North America",
  192: "North America",
  332: "North America",
  214: "North America",
  388: "North America",
  "044": "North America",
  780: "North America",
  630: "North America",
  304: "North America",
  // South America
  "076": "South America",
  "032": "South America",
  152: "South America",
  604: "South America",
  170: "South America",
  862: "South America",
  218: "South America",
  "068": "South America",
  600: "South America",
  858: "South America",
  328: "South America",
  740: "South America",
  254: "South America",
  238: "South America",
  // Europe
  826: "Europe",
  372: "Europe",
  250: "Europe",
  276: "Europe",
  724: "Europe",
  620: "Europe",
  380: "Europe",
  528: "Europe",
  "056": "Europe",
  442: "Europe",
  756: "Europe",
  "040": "Europe",
  616: "Europe",
  203: "Europe",
  703: "Europe",
  348: "Europe",
  642: "Europe",
  100: "Europe",
  300: "Europe",
  191: "Europe",
  705: "Europe",
  "070": "Europe",
  688: "Europe",
  499: "Europe",
  807: "Europe",
  "008": "Europe",
  983: "Europe",
  208: "Europe",
  578: "Europe",
  752: "Europe",
  246: "Europe",
  352: "Europe",
  233: "Europe",
  428: "Europe",
  440: "Europe",
  112: "Europe",
  804: "Europe",
  498: "Europe",
  643: "Europe",
  // Africa
  818: "Africa",
  434: "Africa",
  788: "Africa",
  "012": "Africa",
  504: "Africa",
  732: "Africa",
  478: "Africa",
  686: "Africa",
  270: "Africa",
  324: "Africa",
  624: "Africa",
  694: "Africa",
  430: "Africa",
  384: "Africa",
  288: "Africa",
  768: "Africa",
  204: "Africa",
  566: "Africa",
  562: "Africa",
  466: "Africa",
  854: "Africa",
  148: "Africa",
  120: "Africa",
  140: "Africa",
  226: "Africa",
  266: "Africa",
  178: "Africa",
  180: "Africa",
  "024": "Africa",
  894: "Africa",
  716: "Africa",
  508: "Africa",
  454: "Africa",
  516: "Africa",
  "072": "Africa",
  710: "Africa",
  426: "Africa",
  748: "Africa",
  450: "Africa",
  834: "Africa",
  404: "Africa",
  800: "Africa",
  646: "Africa",
  108: "Africa",
  231: "Africa",
  232: "Africa",
  262: "Africa",
  706: "Africa",
  729: "Africa",
  728: "Africa",
  // Asia
  792: "Asia",
  196: "Asia",
  760: "Asia",
  422: "Asia",
  376: "Asia",
  275: "Asia",
  400: "Asia",
  368: "Asia",
  364: "Asia",
  682: "Asia",
  887: "Asia",
  512: "Asia",
  784: "Asia",
  634: "Asia",
  "048": "Asia",
  414: "Asia",
  268: "Asia",
  "051": "Asia",
  "031": "Asia",
  398: "Asia",
  795: "Asia",
  860: "Asia",
  762: "Asia",
  "004": "Asia",
  586: "Asia",
  356: "Asia",
  524: "Asia",
  "064": "Asia",
  "050": "Asia",
  144: "Asia",
  462: "Asia",
  156: "Asia",
  496: "Asia",
  408: "Asia",
  410: "Asia",
  392: "Asia",
  158: "Asia",
  104: "Asia",
  764: "Asia",
  418: "Asia",
  116: "Asia",
  704: "Asia",
  458: "Asia",
  702: "Asia",
  360: "Asia",
  608: "Asia",
  "096": "Asia",
  626: "Asia",
  // Oceania
  "036": "Oceania",
  554: "Oceania",
  598: "Oceania",
  242: "Oceania",
  "090": "Oceania",
  548: "Oceania",
  540: "Oceania",
  882: "Oceania",
  776: "Oceania",
  296: "Oceania",
  583: "Oceania",
  585: "Oceania",
  584: "Oceania",
};

// Fallback if skill has no `region` field: derive from `category`.
const CATEGORY_TO_REGION = {
  frontend: "North America",
  backend: "Europe",
  tools: "Asia",
  devops: "Africa",
  database: "South America",
  mobile: "Oceania",
};

const resolveRegion = (skill) => {
  if (skill?.region && REGIONS[skill.region]) return skill.region;
  const cat = (skill?.category || "").toLowerCase();
  return CATEGORY_TO_REGION[cat] || "Asia";
};

// world-atlas geo.id can be number or zero-padded string. Normalize.
const normalizeId = (id) => String(id).padStart(3, "0");

export const SkillsSection = ({ showHero = true }) => {
  const { data, isLoading } = useSkills();
  const skills = useMemo(
    () =>
      Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [],
    [data]
  );

  const [activeRegion, setActiveRegion] = useState(null);

  const skillsByRegion = useMemo(() => {
    const map = Object.fromEntries(Object.keys(REGIONS).map((r) => [r, []]));
    skills.forEach((s) => {
      const r = resolveRegion(s);
      if (!map[r]) map[r] = [];
      map[r].push(s);
    });
    return map;
  }, [skills]);

  // Regions that actually have at least one skill — highlighted brighter.
  const populatedRegions = useMemo(
    () =>
      new Set(
        Object.entries(skillsByRegion)
          .filter(([, arr]) => arr.length > 0)
          .map(([r]) => r)
      ),
    [skillsByRegion]
  );

  const activeSkills = activeRegion ? skillsByRegion[activeRegion] || [] : [];
  const visibleSkills = activeRegion ? activeSkills : skills;
  const activeSkillNames = activeSkills.map((skill) => skill.name).join(", ");

  return (
    <section
      id="skills"
      className={`public-hero relative overflow-hidden px-4 pb-16 sm:pb-20 md:pb-24 sm:px-6 lg:px-8 ${
        showHero ? "pt-20 sm:pt-28" : "pt-16 sm:pt-24"
      }`}
    >
      <div className="relative mx-auto max-w-7xl">
        {showHero && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-10 md:mb-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
              <Code2 size={40} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
              Skills &{" "}
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Technologies
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-base-content/70 leading-relaxed">
              Explore the tools and frameworks I use, with the globe acting as a
              visual map for each skill group.
            </p>
          </motion.div>
        )}

        <div className="grid gap-6 sm:gap-8 lg:gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* MAP — circular orthographic globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto aspect-square w-full max-w-35 sm:max-w-160 overflow-hidden rounded-full public-card bg-linear-to-br from-base-100/80 to-base-200/40 shadow-2xl shadow-primary/10 backdrop-blur-sm"
          >
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,var(--color-primary)/15,transparent_55%)]" />
            <ComposableMap
              projection="geoOrthographic"
              projectionConfig={{ scale: 250, rotate: [-10, -20, 0] }}
              width={560}
              height={560}
              style={{ width: "100%", height: "100%" }}
            >
              <circle
                cx={320}
                cy={320}
                r={300}
                fill="var(--color-base-200)"
                opacity={0.35}
              />
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const id = normalizeId(geo.id);
                    const region = COUNTRY_TO_REGION[id];
                    const isPopulated = region && populatedRegions.has(region);
                    const isActive = region && region === activeRegion;

                    const baseFill = isActive
                      ? "var(--color-primary)"
                      : isPopulated
                      ? "var(--color-secondary)"
                      : "var(--color-base-300)";

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => region && setActiveRegion(region)}
                        onMouseLeave={() => setActiveRegion(null)}
                        style={{
                          default: {
                            fill: baseFill,
                            stroke: "var(--color-base-100)",
                            strokeWidth: 0.5,
                            outline: "none",
                            cursor: region ? "pointer" : "default",
                            transition: "fill 200ms ease",
                          },
                          hover: {
                            fill: region ? "var(--color-primary)" : baseFill,
                            outline: "none",
                            cursor: region ? "pointer" : "default",
                          },
                          pressed: {
                            fill: "var(--color-primary)",
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            <AnimatePresence>
              {activeRegion && (
                <motion.div
                  key={activeRegion}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="pointer-events-none absolute bottom-6 left-1/2 flex max-w-[85%] -translate-x-1/2 items-center gap-2 rounded-full border border-primary/30 bg-base-100/90 px-4 py-2 text-sm font-bold text-primary shadow-lg backdrop-blur"
                >
                  <Code2 size={14} className="shrink-0" />
                  <span className="truncate">
                    {activeSkillNames || "No skills mapped"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* SIDE PANEL */}
          <div className="relative">
            <div className="sticky top-16 sm:top-28 rounded-3xl public-card bg-base-100/70 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {activeRegion ? "Mapped Skills" : "All Skills"}
                </h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {visibleSkills.length} skills
                </span>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton h-12 w-full rounded-2xl" />
                  ))}
                </div>
              ) : visibleSkills.length === 0 ? (
                <p className="text-sm text-base-content/60">
                  No skills added yet.
                </p>
              ) : (
                <div className="max-h-105 sm:max-h-120 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  <AnimatePresence mode="popLayout">
                    <motion.ul
                      key={activeRegion || "all-skills"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {visibleSkills.map((skill, i) => (
                        <motion.li
                          key={skill._id || skill.name}
                          onClick={() => {
                            const region = resolveRegion(skill);
                            setActiveRegion(
                              activeRegion === region ? null : region
                            );
                          }}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className={`group cursor-pointer rounded-2xl border p-3 transition-all hover:shadow-md hover:shadow-primary/10 ${
                            activeRegion === resolveRegion(skill)
                              ? "border-primary/50 bg-primary/5 shadow-md shadow-primary/10"
                              : "border-base-200/60 bg-base-100 hover:border-primary/40"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {skill.icon ? (
                                <span className="text-xl">{skill.icon}</span>
                              ) : (
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                  <Code2 size={14} />
                                </span>
                              )}
                              <span className="text-sm font-bold">
                                {skill.name}
                              </span>
                            </div>
                            <span className="text-xs font-black text-primary">
                              {skill.percentage || 80}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-200">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.percentage || 80}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="h-full rounded-full bg-linear-to-r from-primary to-secondary"
                            />
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const { data: settings } = useSettings();
  return (
    <HelmetProvider>
      <Helmet>
        <title>Skills | {settings?.siteTitle || "Portfolio"}</title>
      </Helmet>
      <div className="public-page min-h-screen text-base-content">
        <Navbar />
        <SkillsSection />
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Skills;
