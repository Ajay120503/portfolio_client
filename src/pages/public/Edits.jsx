import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Heart,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Maximize2,
  Wrench,
  Tag,
  Sparkles,
  Camera,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useEdits } from "../../hooks/usePortfolioData";
import { useSettings } from "../../hooks/usePortfolioData";
import { editsAPI } from "../../api";

const CATEGORY_LABELS = {
  photo: "Photos",
  video: "Videos",
  reel: "Reels",
  "before-after": "Before & After",
  other: "Other",
};

// ── Before/After slider ───────────────────────────────────────────────────────
const BeforeAfterSlider = ({ before, after }) => {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  const update = useCallback((clientX) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );
    setPos(pct);
  }, []);

  useEffect(() => {
    const onUp = () => {
      dragging.current = false;
    };
    const onMove = (e) => {
      if (!dragging.current) return;
      update(e.touches ? e.touches[0].clientX : e.clientX);
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchend", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("touchmove", onMove);
    };
  }, [update]);

  return (
    <div
      ref={ref}
      className="relative w-full aspect-video overflow-hidden rounded-2xl cursor-col-resize select-none"
      onMouseDown={(e) => {
        dragging.current = true;
        update(e.clientX);
      }}
      onTouchStart={(e) => {
        dragging.current = true;
        update(e.touches[0].clientX);
      }}
    >
      <img
        src={after}
        className="absolute inset-0 w-full h-full object-cover"
        alt="after"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={before}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${100 / (pos / 100)}%` }}
          alt="before"
        />
      </div>
      <div
        className="absolute top-0 bottom-0"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-0.5 h-full bg-white/80" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <ChevronLeft size={12} className="text-black" />
          <ChevronRight size={12} className="text-black" />
        </div>
      </div>
      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-bold">
        Before
      </span>
      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-bold">
        After
      </span>
    </div>
  );
};

// ── Lightbox (fixed z-index to avoid navbar overlap) ─────────────────────────
const Lightbox = ({ items, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);
  const [liked, setLiked] = useState({});
  const item = items[current];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight")
        setCurrent((c) => Math.min(items.length - 1, c + 1));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length, onClose]);

  const handleLike = async (id) => {
    if (liked[id]) return;
    try {
      await editsAPI.like(id);
      setLiked((l) => ({ ...l, [id]: true }));
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-100 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X size={20} className="text-white" />
      </button>

      {current > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((c) => c - 1);
          }}
          className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
      )}
      {current < items.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((c) => c + 1);
          }}
          className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
      )}

      <div
        className="w-full max-w-5xl mx-auto px-4 flex flex-col lg:flex-row gap-6 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {item.category === "before-after" &&
              item.beforeImage?.url &&
              item.afterImage?.url ? (
                <BeforeAfterSlider
                  before={item.beforeImage.url}
                  after={item.afterImage.url}
                />
              ) : item.mediaType === "video" ? (
                <video
                  src={item.media.url}
                  className="w-full rounded-2xl max-h-[70vh] object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={item.media.url}
                  className="w-full rounded-2xl max-h-[75vh] object-contain"
                  alt={item.title}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full lg:w-72 shrink-0 text-white space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              {item.category}
            </span>
            <h3 className="text-xl font-bold mt-1">{item.title}</h3>
            {item.description && (
              <p className="text-white/60 text-sm mt-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(item._id)}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                liked[item._id]
                  ? "text-red-400"
                  : "text-white/50 hover:text-red-400"
              }`}
            >
              <Heart
                size={16}
                className={liked[item._id] ? "fill-red-400" : ""}
              />
              {item.likes + (liked[item._id] ? 1 : 0)}
            </button>
            <span className="flex items-center gap-1.5 text-sm text-white/40">
              <Eye size={14} /> {item.views}
            </span>
          </div>

          {item.tools?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1">
                <Wrench size={11} /> Tools
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.tools.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.tags?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1">
                <Tag size={11} /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-white/30 text-center">
            {current + 1} / {items.length}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main masonry grid card ────────────────────────────────────────────────────
const EditCard = ({ item, index, onClick }) => {
  const isVideo = item.mediaType === "video";
  const isBeforeAfter = item.category === "before-after";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      className="group relative cursor-pointer"
      onClick={() => onClick(index)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-base-200">
        {isVideo ? (
          <div className="aspect-video">
            {item.media.thumbnail ? (
              <img
                src={item.media.thumbnail}
                className="w-full h-full object-cover"
                alt={item.title}
              />
            ) : (
              <video
                src={item.media.url}
                className="w-full h-full object-cover"
                muted
              />
            )}
          </div>
        ) : isBeforeAfter ? (
          <div className="aspect-video">
            <img
              src={item.afterImage?.url || item.media.url}
              className="w-full h-full object-cover"
              alt={item.title}
            />
          </div>
        ) : (
          <img
            src={item.media.url}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={item.title}
            style={{
              aspectRatio:
                index % 3 === 0 ? "3/4" : index % 5 === 0 ? "1/1" : "4/3",
            }}
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white font-bold text-sm truncate">
              {item.title}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-white/60 text-xs flex items-center gap-1">
                <Eye size={11} /> {item.views}
              </span>
              <span className="text-white/60 text-xs flex items-center gap-1">
                <Heart size={11} /> {item.likes}
              </span>
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Maximize2 size={14} className="text-white" />
            </div>
          </div>
        </div>

        {item.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-warning/90 text-black text-xs font-bold">
              <Sparkles size={10} /> Featured
            </span>
          </div>
        )}
        {isVideo && (
          <div className="absolute top-3 right-3">
            <div className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
              <Play size={12} className="text-white ml-0.5" />
            </div>
          </div>
        )}
        {isBeforeAfter && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded-full bg-black/60 text-white text-xs font-bold">
              B/A
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Public Edits Section (with improved layout) ──────────────────────────────
export const EditsSection = ({ showHero = true }) => {
  const { data, isLoading } = useEdits();
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const edits = Array.isArray(data) ? data : [];
  const categories = ["all", ...new Set(edits.map((e) => e.category))];
  const filtered =
    activeCategory === "all"
      ? edits
      : edits.filter((e) => e.category === activeCategory);

  if (isLoading) {
    return (
      <section className="py-32 flex justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </section>
    );
  }

  return (
    <section
      id="edits"
      className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8"
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
              <Camera size={40} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
              Creative{" "}
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Edits
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-base-content/60 leading-relaxed">
              A curated showcase of photo edits, video productions, and creative
              work. Click any piece to explore.
            </p>
          </motion.div>
        )}

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-content shadow-md shadow-primary/20"
                  : "bg-base-200/60 text-base-content/60 hover:text-base-content hover:bg-base-200"
              }`}
            >
              {cat === "all"
                ? `All (${edits.length})`
                : `${CATEGORY_LABELS[cat] || cat} (${
                    edits.filter((e) => e.category === cat).length
                  })`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Camera size={40} className="mx-auto text-base-content/20 mb-3" />
            <p className="text-base-content/50">
              No edits in this category yet.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            {filtered.map((item, i) => (
              <div key={item._id} className="break-inside-avoid mb-4">
                <EditCard
                  item={item}
                  index={i}
                  onClick={(idx) => setLightboxIndex(idx)}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={filtered}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ── Full page (includes Navbar & Footer) ─────────────────────────────────────
const Edits = () => {
  const { data: settings } = useSettings();
  return (
    <HelmetProvider>
      <Helmet>
        <title>Edits | {settings?.siteTitle || "Portfolio"}</title>
        <meta
          name="description"
          content="Creative photo and video edits showcase"
        />
      </Helmet>
      <div className="public-page min-h-screen text-base-content">
        <Navbar />
        <main>
          <EditsSection />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Edits;
