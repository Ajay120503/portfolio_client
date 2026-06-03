import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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
  TrendingUp,
  Shuffle,
  ArrowUpDown,
  RefreshCw,
  Star,
  Volume2,
  VolumeX,
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

// ── Before/After slider (enhanced) ───────────────────────────────────────────
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
      className="relative w-full aspect-video overflow-hidden rounded-2xl cursor-ew-resize select-none shadow-2xl"
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
        <div className="w-0.5 h-full bg-white/90 shadow-lg" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center ring-2 ring-white/30">
          <ChevronLeft size={14} className="text-black" />
          <ChevronRight size={14} className="text-black" />
        </div>
      </div>
      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-bold tracking-wide shadow-sm">
        BEFORE
      </span>
      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-bold tracking-wide shadow-sm">
        AFTER
      </span>
    </div>
  );
};

// ── Enhanced Lightbox with gestures and interactions ─────────────────────────
const Lightbox = ({ items, startIndex, onClose, onLike, onView }) => {
  const [current, setCurrent] = useState(startIndex);
  const [likedLocal, setLikedLocal] = useState({});
  const [touchStart, setTouchStart] = useState(0);
  const item = items[current];

  useEffect(() => {
    if (item && onView) onView(item._id);
  }, [item, onView]);

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
    if (likedLocal[id]) return;
    setLikedLocal((l) => ({ ...l, [id]: true }));
    if (onLike) await onLike(id);
  };

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrent((c) => Math.min(items.length - 1, c + 1));
      else setCurrent((c) => Math.max(0, c - 1));
    }
    setTouchStart(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm"
      >
        <X size={22} className="text-white" />
      </button>

      {current > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((c) => c - 1);
          }}
          className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
      )}
      {current < items.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((c) => c + 1);
          }}
          className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      )}

      <div
        className="w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-6 items-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
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
                  className="w-full rounded-2xl max-h-[75vh] object-contain shadow-2xl"
                  controls
                  autoPlay
                  loop
                />
              ) : (
                <img
                  src={item.media.url}
                  className="w-full rounded-2xl max-h-[75vh] object-contain shadow-2xl"
                  alt={item.title}
                  loading="lazy"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full lg:w-80 shrink-0 text-white space-y-5 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
            <h3 className="text-2xl font-bold mt-1">{item.title}</h3>
            {item.description && (
              <p className="text-white/60 text-sm mt-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLike(item._id)}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                likedLocal[item._id]
                  ? "text-red-400"
                  : "text-white/50 hover:text-red-400"
              }`}
            >
              <Heart
                size={18}
                className={likedLocal[item._id] ? "fill-red-400" : ""}
              />
              {item.likes + (likedLocal[item._id] ? 1 : 0)}
            </motion.button>
            <span className="flex items-center gap-1.5 text-sm text-white/40">
              <Eye size={16} /> {item.views}
            </span>
          </div>

          {item.tools?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 flex items-center gap-1">
                <Wrench size={12} /> Tools
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
              <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 flex items-center gap-1">
                <Tag size={12} /> Tags
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

          <div className="pt-2 text-xs text-white/30 text-center border-t border-white/10">
            {current + 1} / {items.length}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Enhanced Edit Card with hover video preview & inline like ─────────────────
const EditCard = ({ item, index, onClick, onLike, isLikedByUser }) => {
  const isVideo = item.mediaType === "video";
  const isBeforeAfter = item.category === "before-after";
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (isVideo && videoRef.current && isHovering) {
      videoRef.current.play().catch(() => {});
      videoRef.current.muted = isMuted;
    } else if (isVideo && videoRef.current && !isHovering) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovering, isVideo, isMuted]);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isLikedByUser) onLike(item._id);
  };

  const handleVideoMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) videoRef.current.muted = !isMuted;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05 }}
      className="group relative cursor-pointer"
      onClick={() => onClick(index)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-base-200 shadow-lg hover:shadow-2xl transition-shadow duration-500">
        {isVideo ? (
          <div className="aspect-video relative">
            <video
              ref={videoRef}
              src={item.media.url}
              poster={item.media.thumbnail}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300" />
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleVideoMute}
                className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
            </div>
          </div>
        ) : isBeforeAfter ? (
          <div className="aspect-video relative">
            <img
              src={item.afterImage?.url || item.media.url}
              className="w-full h-full object-cover"
              alt={item.title}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300" />
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <img
              src={item.media.url}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt={item.title}
              style={{
                aspectRatio:
                  index % 3 === 0 ? "3/4" : index % 5 === 0 ? "1/1" : "4/3",
              }}
              loading="lazy"
            />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white font-bold text-base line-clamp-1">
              {item.title}
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <Eye size={12} /> {item.views}
                </span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleLikeClick}
                  className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                    isLikedByUser
                      ? "text-red-400"
                      : "text-white/70 hover:text-red-400"
                  }`}
                >
                  <Heart
                    size={12}
                    className={isLikedByUser ? "fill-red-400" : ""}
                  />
                  {item.likes + (isLikedByUser ? 1 : 0)}
                </motion.button>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Maximize2 size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        {item.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-linear-to-r from-amber-400 to-orange-500 text-black text-xs font-bold shadow-lg">
              <Sparkles size={12} /> Featured
            </span>
          </div>
        )}
        {isVideo && !isBeforeAfter && (
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <Play size={14} className="text-white ml-0.5" />
            </div>
          </div>
        )}
        {isBeforeAfter && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-bold shadow-md">
              BEFORE/AFTER
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Edits Section with all enhancements ─────────────────────────────────
export const EditsSection = ({ showHero = true }) => {
  const { data: rawEdits, isLoading } = useEdits();
  const [localEdits, setLocalEdits] = useState([]);
  const [likedMap, setLikedMap] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [orderType, setOrderType] = useState("default");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Sync local edits with fetched data
  useEffect(() => {
    if (rawEdits && Array.isArray(rawEdits)) {
      setLocalEdits(rawEdits);
    }
  }, [rawEdits]);

  const handleLike = async (id) => {
    if (likedMap[id]) return;
    setLikedMap((prev) => ({ ...prev, [id]: true }));
    setLocalEdits((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
    try {
      await editsAPI.like(id);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleView = async (id) => {
    setLocalEdits((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, views: item.views + 1 } : item
      )
    );
    // Optional: call API if exists
    if (editsAPI.incrementView) await editsAPI.incrementView(id);
  };

  // Filter and sort logic
  const filteredEdits = useMemo(() => {
    let filtered =
      activeCategory === "all"
        ? localEdits
        : localEdits.filter((e) => e.category === activeCategory);
    if (orderType === "likes")
      filtered = [...filtered].sort((a, b) => b.likes - a.likes);
    else if (orderType === "views")
      filtered = [...filtered].sort((a, b) => b.views - a.views);
    else if (orderType === "random")
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    else filtered = [...filtered]; // default order
    return filtered;
  }, [localEdits, activeCategory, orderType]);

  const categories = useMemo(
    () => ["all", ...new Set(localEdits.map((e) => e.category))],
    [localEdits]
  );

  if (isLoading) {
    return (
      <section className="py-32 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary" />
          <p className="text-base-content/50 animate-pulse">
            Loading creative edits...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="edits"
      className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {showHero && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-16 text-center"
          >
            <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-primary/20 to-secondary/20 text-primary mb-6 shadow-xl backdrop-blur-sm">
              <Camera size={44} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
              Creative{" "}
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Edits
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-base-content/70 leading-relaxed">
              A curated showcase of photo edits, video productions, and creative
              work. Click any piece to explore, like your favorites, and get
              inspired.
            </p>
          </motion.div>
        )}

        {/* Sticky filter + sort bar */}
        <div className="sticky top-20 z-20 bg-base-100/80 backdrop-blur-md rounded-2xl p-3 mb-10 shadow-lg border border-base-200">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                    activeCategory === cat
                      ? "bg-primary text-primary-content shadow-md shadow-primary/30 scale-105"
                      : "bg-base-200/80 text-base-content/70 hover:text-base-content hover:bg-base-200"
                  }`}
                >
                  {cat === "all"
                    ? `All (${localEdits.length})`
                    : `${CATEGORY_LABELS[cat] || cat} (${
                        localEdits.filter((e) => e.category === cat).length
                      })`}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setOrderType("default")}
                className={`p-2 rounded-full transition-all ${
                  orderType === "default"
                    ? "bg-primary/20 text-primary"
                    : "bg-base-200 text-base-content/60 hover:bg-base-300"
                }`}
                title="Default order"
              >
                <ArrowUpDown size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setOrderType("likes")}
                className={`p-2 rounded-full transition-all ${
                  orderType === "likes"
                    ? "bg-primary/20 text-primary"
                    : "bg-base-200 text-base-content/60 hover:bg-base-300"
                }`}
                title="Most liked"
              >
                <TrendingUp size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setOrderType("random")}
                className={`p-2 rounded-full transition-all ${
                  orderType === "random"
                    ? "bg-primary/20 text-primary"
                    : "bg-base-200 text-base-content/60 hover:bg-base-300"
                }`}
                title="Random shuffle"
              >
                <Shuffle size={18} />
              </motion.button>
              {orderType !== "default" && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOrderType("default")}
                  className="p-2 rounded-full bg-base-200 text-primary hover:bg-base-300"
                  title="Reset order"
                >
                  <RefreshCw size={18} />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {filteredEdits.length === 0 ? (
          <div className="text-center py-24">
            <Camera size={56} className="mx-auto text-base-content/20 mb-4" />
            <p className="text-base-content/50 text-lg">
              No edits in this category yet.
            </p>
          </div>
        ) : (
          <LayoutGroup>
            <motion.div
              layout
              className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
            >
              {filteredEdits.map((item, i) => (
                <div key={item._id} className="break-inside-avoid mb-5">
                  <EditCard
                    item={item}
                    index={i}
                    onClick={(idx) => setLightboxIndex(idx)}
                    onLike={handleLike}
                    isLikedByUser={likedMap[item._id]}
                  />
                </div>
              ))}
            </motion.div>
          </LayoutGroup>
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={filteredEdits}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onLike={handleLike}
            onView={handleView}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ── Full page with layout ────────────────────────────────────────────────────
const Edits = () => {
  const { data: settings } = useSettings();
  return (
    <HelmetProvider>
      <Helmet>
        <title>Edits | {settings?.siteTitle || "Portfolio"}</title>
        <meta
          name="description"
          content="Creative photo and video edits showcase - unique edits gallery with interactive features"
        />
      </Helmet>
      <div className="public-page min-h-screen bg-linear-to-b from-base-100 to-base-200">
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
