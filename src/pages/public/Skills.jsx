import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Code2, RotateCcw } from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useSettings, useSkills } from "../../hooks/usePortfolioData";
import { useTheme } from "../../hooks/useTheme";

// Category cluster positions in 3D space
// const CLUSTERS = {
//   frontend: { cx: 1.2, cy: -0.8, cz: 0.0 },
//   backend: { cx: -1.2, cy: 0.2, cz: 0.5 },
//   database: { cx: 0.2, cy: 1.2, cz: -0.8 },
//   devops: { cx: -0.5, cy: -1.0, cz: -1.0 },
//   tools: { cx: 1.0, cy: 0.8, cz: 1.0 },
//   mobile: { cx: -0.8, cy: -0.5, cz: 0.8 },
//   design: { cx: 0.5, cy: -1.2, cz: 0.5 },
//   other: { cx: 0.0, cy: 0.0, cz: 0.0 },
// };

const CLUSTERS = {
  frontend: { cx: 0.7, cy: -0.4, cz: 0.0 },
  backend: { cx: -0.7, cy: 0.2, cz: 0.3 },
  database: { cx: 0.2, cy: 0.7, cz: -0.4 },
  devops: { cx: -0.4, cy: -0.7, cz: -0.5 },
  tools: { cx: 0.6, cy: 0.5, cz: 0.6 },
  mobile: { cx: -0.5, cy: -0.3, cz: 0.5 },
  design: { cx: 0.4, cy: -0.7, cz: 0.3 },
  other: { cx: 0.0, cy: 0.0, cz: 0.0 },
};

const CATEGORY_COLORS = {
  frontend: "#C6FF34",
  backend: "#9FE870",
  database: "#38BDF8",
  devops: "#F59E0B",
  tools: "#EF4444",
  mobile: "#A78BFA",
  design: "#F472B6",
  other: "#94A3B8",
};

const LIGHT_COLORS = {
  frontend: "#1D4ED8",
  backend: "#0891B2",
  database: "#7C3AED",
  devops: "#D97706",
  tools: "#DC2626",
  mobile: "#7C3AED",
  design: "#DB2777",
  other: "#64748B",
};

const ConstellationCanvas = ({ nodes, theme }) => {
  const canvasRef = useRef(null);
  // const stateRef = useRef({
  //   rotX: 0.3,
  //   rotY: 0.5,
  //   zoom: 160,
  //   dragStart: null,
  //   autoRotate: true,
  //   time: 0,
  //   hovered: null,
  //   projected: [],
  // });
  const stateRef = useRef({
    rotX: 0.3,
    rotY: 0.5,
    zoom: 240,
    dragStart: null,
    autoRotate: true,
    time: 0,
    hovered: null,
    projected: [],
  });
  const [tooltip, setTooltip] = useState(null);
  const animRef = useRef(null);

  const getColor = useCallback(
    (cat) => {
      const key = (cat || "other").toLowerCase();
      return theme === "black"
        ? CATEGORY_COLORS[key] || CATEGORY_COLORS.other
        : LIGHT_COLORS[key] || LIGHT_COLORS.other;
    },
    [theme]
  );

  // Build 3D node positions
  const nodes3d = useMemo(() => {
    return nodes.map((s, i) => {
      const key = (s.category || "other").toLowerCase();
      const cl = CLUSTERS[key] || CLUSTERS.other;
      const r = 0.45 + Math.random() * 0.45;
      const a = (i / nodes.length) * Math.PI * 2 + Math.random() * 0.8;
      const b = (Math.random() - 0.5) * Math.PI;
      return {
        ...s,
        x: cl.cx + Math.cos(a) * Math.cos(b) * r,
        y: cl.cy + Math.sin(b) * r,
        z: cl.cz + Math.sin(a) * Math.cos(b) * r,
        baseR: 4 + ((s.percentage || 80) / 100) * 7,
        color: getColor(s.category),
      };
    });
  }, [nodes, getColor]);

  // Edges within same category
  const edges = useMemo(() => {
    const e = [];
    nodes3d.forEach((a, i) => {
      nodes3d.forEach((b, j) => {
        if (j <= i) return;
        const ka = (a.category || "other").toLowerCase();
        const kb = (b.category || "other").toLowerCase();
        if (ka === kb) e.push([i, j]);
      });
    });
    return e;
  }, [nodes3d]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const project = (x, y, z) => {
      const cosY = Math.cos(s.rotY),
        sinY = Math.sin(s.rotY);
      const x2 = x * cosY + z * sinY;
      const z2 = -x * sinY + z * cosY;
      const cosX = Math.cos(s.rotX),
        sinX = Math.sin(s.rotX);
      const y2 = y * cosX - z2 * sinX;
      const z3 = y * sinX + z2 * cosX;
      const fov = 4;
      const scale = s.zoom / (z3 / fov + 2);
      return {
        sx: canvas.width / 2 + x2 * scale,
        sy: canvas.height / 2 + y2 * scale,
        sz: z3,
        scale,
      };
    };

    const draw = () => {
      s.time += 0.005;
      if (s.autoRotate) s.rotY += 0.003;

      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Project all nodes with subtle float
      s.projected = nodes3d.map((n, i) => {
        const wave = Math.sin(s.time * 1.2 + i * 0.7) * 0.04;
        return project(n.x, n.y + wave, n.z);
      });

      // Draw edges
      edges.forEach(([ai, bi]) => {
        const a = s.projected[ai],
          b = s.projected[bi];
        if (!a || !b) return;
        const avgZ = (a.sz + b.sz) / 2;
        const op = Math.max(0, (1 - avgZ / 3) * 0.18);
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.strokeStyle = nodes3d[ai].color;
        ctx.globalAlpha = op;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Sort back→front
      const order = [...nodes3d.keys()].sort(
        (a, b) => (s.projected[b]?.sz || 0) - (s.projected[a]?.sz || 0)
      );

      order.forEach((i) => {
        const n = nodes3d[i];
        const p = s.projected[i];
        if (!p) return;
        const depth = (p.sz + 3) / 6;
        const op = Math.max(0.2, 0.3 + depth * 0.7);
        const r = n.baseR * (0.55 + depth * 0.5);
        const isHov = s.hovered === i;

        // Glow
        if (isHov || depth > 0.45) {
          const gr = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 3);
          gr.addColorStop(0, n.color + "50");
          gr.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = gr;
          ctx.globalAlpha = isHov ? 0.9 : op * 0.4;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = op * (isHov ? 1.1 : 0.88);
        ctx.fill();

        // Highlight dot
        ctx.beginPath();
        ctx.arc(p.sx - r * 0.25, p.sy - r * 0.25, r * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.globalAlpha = op * 0.6;
        ctx.fill();

        // Label
        if (isHov || (r > 7 && depth > 0.55)) {
          ctx.globalAlpha = op * (isHov ? 1 : 0.65);
          ctx.fillStyle = isHov
            ? n.color
            : theme === "black"
            ? "rgba(255,255,255,0.8)"
            : "rgba(0,0,0,0.7)";
          ctx.font = `${isHov ? 600 : 500} ${isHov ? 12 : 10}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(n.name, p.sx, p.sy + r + 13);
        }
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Mouse events
    const onMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      s.dragStart = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        rx: s.rotX,
        ry: s.rotY,
      };
      s.autoRotate = false;
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (s.dragStart) {
        s.rotY = s.dragStart.ry + (mx - s.dragStart.x) * 0.005;
        s.rotX = s.dragStart.rx + (my - s.dragStart.y) * 0.005;
        return;
      }

      let hit = null;
      s.projected.forEach((p, i) => {
        if (!p) return;
        if (Math.hypot(p.sx - mx, p.sy - my) < nodes3d[i].baseR + 6) hit = i;
      });
      s.hovered = hit;
      if (hit !== null) {
        const p = s.projected[hit];
        setTooltip({
          x: p.sx + 14,
          y: p.sy - 24,
          name: nodes3d[hit].name,
          cat: nodes3d[hit].category,
          pct: nodes3d[hit].percentage || 80,
          color: nodes3d[hit].color,
        });
      } else {
        setTooltip(null);
      }
    };

    const onMouseUp = () => {
      s.dragStart = null;
    };
    const onWheel = (e) => {
      s.zoom = Math.max(80, Math.min(320, s.zoom - e.deltaY * 0.3));
    };
    const onLeave = () => {
      s.hovered = null;
      setTooltip(null);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [nodes3d, edges, theme]);

  // const resetView = () => {
  //   stateRef.current.rotX = 0.3;
  //   stateRef.current.rotY = 0.5;
  //   stateRef.current.zoom = 160;
  //   stateRef.current.autoRotate = true;
  // };

  const resetView = () => {
    stateRef.current.rotX = 0.3;
    stateRef.current.rotY = 0.5;
    stateRef.current.zoom = 240;
    stateRef.current.autoRotate = true;
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="absolute pointer-events-none z-10 public-card bg-base-100/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-xl"
            style={{
              left: Math.min(tooltip.x, window.innerWidth - 180),
              top: Math.max(10, tooltip.y),
            }}
          >
            <p className="text-sm font-bold" style={{ color: tooltip.color }}>
              {tooltip.name}
            </p>
            <p className="text-xs text-base-content/50 capitalize mt-0.5">
              {tooltip.cat} · {tooltip.pct}%
            </p>
            <div className="mt-1.5 h-1 w-24 rounded-full bg-base-300 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${tooltip.pct}%`,
                  background: tooltip.color,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={resetView}
          className="w-8 h-8 rounded-xl public-card bg-base-100/80 flex items-center justify-center text-base-content/50 hover:text-primary transition-colors"
          title="Reset view"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <p className="text-xs text-base-content/30 font-mono">
          Drag · Scroll to Zoom
        </p>
      </div>
    </div>
  );
};

export const SkillsSection = ({ showHero = true }) => {
  const { data, isLoading } = useSkills();
  const { data: settings } = useSettings();
  const { theme } = useTheme(settings?.defaultTheme);
  const [activeCategory, setActiveCategory] = useState(null);

  const skills = useMemo(
    () =>
      Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [],
    [data]
  );

  const categories = useMemo(() => {
    const map = {};
    skills.forEach((s) => {
      const k = (s.category || "other").toLowerCase();
      if (!map[k]) map[k] = [];
      map[k].push(s);
    });
    return map;
  }, [skills]);

  const filteredSkills = activeCategory
    ? skills.filter(
        (s) => (s.category || "other").toLowerCase() === activeCategory
      )
    : skills;

  if (isLoading) {
    return (
      <section className="py-32 flex justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </section>
    );
  }

  return (
    <section
      id="skills"
      className="public-hero relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-7xl">
        {showHero && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
              <Code2 size={40} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
              Skills &{" "}
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Technologies
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-base-content/60 leading-relaxed">
              An interactive 3D constellation — each star is a skill. Drag to
              rotate, scroll to zoom, hover to inspect.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative public-card rounded-3xl overflow-hidden h-87.5 sm:h-112.5 lg:h-130"
          >
            <ConstellationCanvas nodes={filteredSkills} theme={theme} />
          </motion.div>

          {/* Side panel */}
          <div className="flex flex-col gap-4">
            {/* Category filter */}
            <div className="public-card rounded-3xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-3">
                Filter by category
              </p>
              <div className="flex flex-wrap gap-2 overflow-hidden">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all max-w-full truncate ${
                    !activeCategory
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content/60 hover:text-primary"
                  }`}
                >
                  All
                </button>
                {Object.entries(categories).map(([cat, arr]) => {
                  const color =
                    theme === "black"
                      ? CATEGORY_COLORS[cat] || CATEGORY_COLORS.other
                      : LIGHT_COLORS[cat] || LIGHT_COLORS.other;
                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        setActiveCategory(activeCategory === cat ? null : cat)
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                        activeCategory === cat
                          ? "shadow-md"
                          : "bg-base-200 text-base-content/60 hover:text-base-content"
                      }`}
                      style={
                        activeCategory === cat
                          ? {
                              background: color,
                              color: theme === "black" ? "#000" : "#fff",
                            }
                          : {}
                      }
                    >
                      {cat} ({arr.length})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skill list */}
            <div className="public-card rounded-3xl p-4 flex-1 overflow-hidden">
              <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-3">
                {activeCategory ? `${activeCategory} skills` : "All skills"} ·{" "}
                {filteredSkills.length}
              </p>
              <div className="space-y-2 max-h-62.5 sm:max-h-87.5 lg:max-h-96 overflow-y-auto pr-1">
                <AnimatePresence mode="popLayout">
                  {filteredSkills.map((skill, i) => {
                    const cat = (skill.category || "other").toLowerCase();
                    const color =
                      theme === "black"
                        ? CATEGORY_COLORS[cat] || CATEGORY_COLORS.other
                        : LIGHT_COLORS[cat] || LIGHT_COLORS.other;
                    return (
                      <motion.div
                        key={skill._id || skill.name}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-base-200/50 transition-colors group"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: color }}
                        />
                        <span className="text-sm font-medium flex-1 truncate">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-base-300 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.percentage || 80}%` }}
                              transition={{ duration: 0.5, delay: i * 0.03 }}
                              className="h-full rounded-full"
                              style={{ background: color }}
                            />
                          </div>
                          <span className="text-xs font-bold text-base-content/40 w-8 text-right">
                            {skill.percentage || 80}%
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Legend */}
            <div className="public-card rounded-3xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-3">
                Constellation legend
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(CATEGORY_COLORS).map(([cat]) => {
                  const color =
                    theme === "black"
                      ? CATEGORY_COLORS[cat]
                      : LIGHT_COLORS[cat];
                  const count = categories[cat]?.length || 0;
                  if (!count) return null;
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: color }}
                      />
                      <span className="text-xs text-base-content/50 capitalize truncate">
                        {cat}
                      </span>
                      <span className="text-xs text-base-content/30 ml-auto">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
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
