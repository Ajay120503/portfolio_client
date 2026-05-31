import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  ExternalLink,
  Github,
  Search,
  LayoutGrid,
  FolderKanban,
  Star,
  ArrowRight,
  Code2,
  X,
  Filter,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SkeletonCard } from "../../components/ui/Loader";
import { useProjects, useSettings } from "../../hooks/usePortfolioData";

const Projects = () => {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: settings } = useSettings();
  const { data, isLoading } = useProjects({
    category: category !== "All" ? category : undefined,
    search: search || undefined,
  });

  const projects = data?.data || [];
  const categories = [
    "All",
    ...new Set(projects.map((p) => p.category).filter(Boolean)),
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Projects | {settings?.siteTitle || "Portfolio"}</title>
        <meta
          name="description"
          content="Explore my portfolio projects – modern web applications, full-stack solutions, and creative designs."
        />
      </Helmet>

      <div className="public-page min-h-screen overflow-hidden">
        <Navbar />

        {/* HERO SECTION */}
        <section className="public-hero relative pt-10 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="relative max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-12 md:mb-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
                <FolderKanban size={40} />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
                My{" "}
                <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Projects
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-base-content/70 leading-relaxed">
                A collection of modern web, full‑stack, and creative projects
                built with performance, scalability, and beautiful UI in mind.
              </p>
            </motion.div>

            {/* Filters Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 sm:mb-10 md:mb-12"
            >
              <div className="card rounded-3xl items-center">
                <div className="flex flex-col lg:flex-row gap-5">
                  {/* Search input */}
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/40"
                    />
                    <input
                      type="text"
                      placeholder="Search projects by title, technology, or category..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="input input-bordered pl-14 h-12 rounded-xl text-base bg-base-100/50"
                    />
                  </div>

                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden btn btn-outline rounded-xl gap-2"
                  >
                    <Filter size={16} />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>

                  {/* Category filters - desktop always, mobile toggle */}
                  <div
                    className={`${
                      showFilters ? "flex" : "hidden"
                    } lg:flex flex-wrap gap-3`}
                  >
                    {categories.map((cat) => (
                      <motion.button
                        key={cat}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setCategory(cat)}
                        className={`btn rounded-xl px-5 transition-all ${
                          category === cat
                            ? "btn-primary shadow-md"
                            : "btn-ghost border border-base-300 hover:border-primary/50"
                        }`}
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results stats */}
            {!isLoading && projects.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-base-content/60">
                  <LayoutGrid size={16} />
                  <span>
                    Showing{" "}
                    <span className="font-bold text-primary">
                      {projects.length}
                    </span>{" "}
                    projects
                    {category !== "All" && ` in "${category}"`}
                    {search && ` matching "${search}"`}
                  </span>
                </div>
                {(category !== "All" || search) && (
                  <button
                    onClick={() => {
                      setCategory("All");
                      setSearch("");
                    }}
                    className="btn btn-xs btn-ghost gap-1"
                  >
                    <X size={12} />
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Loading skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Project grid */}
            {!isLoading && (
              <AnimatePresence mode="wait">
                {projects.length > 0 ? (
                  <motion.div
                    key="grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
                  >
                    {projects.map((project) => (
                      <motion.div
                        key={project._id}
                        variants={itemVariants}
                        whileHover={{ y: -8 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="group h-full"
                      >
                        <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          {/* Image container */}
                          <div className="relative h-56 overflow-hidden">
                            {project.coverImage?.url ? (
                              <img
                                src={project.coverImage.url}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-linear-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center text-6xl">
                                🚀
                              </div>
                            )}
                            {/* Dark overlay for text contrast */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-80" />

                            {/* Featured badge */}
                            {project.featured && (
                              <div className="absolute top-4 left-4 z-10">
                                <div className="badge badge-warning gap-1 px-3 py-3 shadow-md">
                                  <Star size={12} fill="currentColor" />
                                  Featured
                                </div>
                              </div>
                            )}

                            {/* Status badge */}
                            <div className="absolute top-4 right-4 z-10">
                              <div
                                className={`badge px-3 py-3 shadow-md ${
                                  project.status === "completed"
                                    ? "badge-success"
                                    : project.status === "in-progress"
                                    ? "badge-warning"
                                    : "badge-ghost"
                                }`}
                              >
                                {project.status === "completed"
                                  ? "Completed"
                                  : project.status === "in-progress"
                                  ? "In Progress"
                                  : "Archived"}
                              </div>
                            </div>

                            {/* Floating action buttons */}
                            <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                              {project.githubUrl && (
                                <motion.a
                                  whileHover={{ scale: 1.1 }}
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-circle btn-sm bg-base-100/90 backdrop-blur-md border-none hover:bg-primary hover:text-white transition-all"
                                  aria-label="GitHub Repository"
                                >
                                  <Github size={16} />
                                </motion.a>
                              )}
                              {project.liveUrl && (
                                <motion.a
                                  whileHover={{ scale: 1.1 }}
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-circle btn-sm bg-base-100/90 backdrop-blur-md border-none hover:bg-primary hover:text-white transition-all"
                                  aria-label="Live Demo"
                                >
                                  <ExternalLink size={16} />
                                </motion.a>
                              )}
                            </div>
                          </div>

                          {/* Card content */}
                          <div className="card-body p-6 flex flex-col flex-1">
                            {/* Category */}
                            <div className="flex items-center gap-2 mb-2">
                              <FolderKanban
                                size={14}
                                className="text-primary"
                              />
                              <span className="text-sm font-medium text-primary">
                                {project.category || "Uncategorized"}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {project.title}
                            </h3>

                            {/* Description */}
                            <p className="text-base-content/65 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                              {project.description}
                            </p>

                            {/* Tech stack */}
                            {project.technologies?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-5">
                                {project.technologies
                                  .slice(0, 4)
                                  .map((tech) => (
                                    <span
                                      key={tech}
                                      className="badge badge-primary badge-outline px-2.5 py-2 text-xs"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                {project.technologies.length > 4 && (
                                  <span className="badge badge-ghost px-2.5 py-2 text-xs">
                                    +{project.technologies.length - 4}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Footer button */}
                            <div className="mt-auto flex items-center justify-between gap-4">
                              <Link
                                to={`/projects/${project.slug}`}
                                className="btn btn-primary rounded-xl flex-1 gap-2 shadow-md hover:shadow-lg transition-all"
                              >
                                View Project
                                <ArrowRight size={16} />
                              </Link>
                              <div className="flex items-center gap-1 text-xs text-base-content/50">
                                <Code2 size={14} />
                                <span>{project.technologies?.length || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-24"
                  >
                    <div className="w-28 h-28 mx-auto rounded-full bg-base-200 flex items-center justify-center text-6xl mb-6">
                      🔍
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
                      No projects found
                    </h3>
                    <p className="text-base-content/60 max-w-md mx-auto">
                      Try adjusting your search or clearing the filters.
                    </p>
                    <button
                      onClick={() => {
                        setCategory("All");
                        setSearch("");
                      }}
                      className="btn btn-primary mt-6 gap-2"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Projects;
