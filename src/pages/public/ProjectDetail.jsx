import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  ExternalLink,
  Github,
  ArrowLeft,
  Eye,
  Calendar,
  Layers3,
  Star,
  Code2,
  ChevronRight,
  FileQuestion,
  FileText,
  FolderKanban,
  ImageIcon,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useProjectBySlug, useSettings } from "../../hooks/usePortfolioData";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const { data: project, isLoading } = useProjectBySlug(slug);
  const { data: settings } = useSettings();

  /* ===== LOADING ===== */
  if (isLoading) {
    return (
      <div className="public-page min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-base-content/60 animate-pulse">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  /* ===== NOT FOUND ===== */
  if (!project) {
    return (
      <div className="public-page min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <FileQuestion size={72} className="mb-5 text-primary/60" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">
            Project not found
          </h2>
          <p className="text-base-content/60 mb-6 max-w-md">
            The project you’re looking for doesn’t exist or may have been
            removed.
          </p>
          <Link
            to="/projects"
            className="btn btn-primary rounded-2xl px-8 gap-2"
          >
            <ArrowLeft size={18} /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const year = project.createdAt
    ? new Date(project.createdAt).getFullYear()
    : null;

  return (
    <HelmetProvider>
      <Helmet>
        <title>
          {project.title} | {settings?.siteTitle || "Portfolio"}
        </title>
        <meta name="description" content={project.description} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.description} />
        {project.coverImage?.url && (
          <meta property="og:image" content={project.coverImage.url} />
        )}
      </Helmet>

      <div className="public-page min-h-screen overflow-hidden">
        <Navbar />

        {/* ===== HERO ===== */}
        <section className="public-hero relative pt-10 pb-10 sm:pb-12 md:pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Breadcrumb + back */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between mb-8 flex-wrap gap-3"
            >
              <Link to="/projects" className="btn btn-ghost rounded-2xl gap-2">
                <ArrowLeft size={18} /> Back to Projects
              </Link>

              <div className="hidden sm:flex items-center gap-2 text-sm text-base-content/60">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight size={14} />
                <Link
                  to="/projects"
                  className="hover:text-primary transition-colors"
                >
                  Projects
                </Link>
                <ChevronRight size={14} />
                <span className="text-base-content/80 font-medium truncate max-w-45">
                  {project.title}
                </span>
              </div>
            </motion.div>

            {/* Cover image */}
            {project.coverImage?.url && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="public-image-frame relative rounded-4xl overflow-hidden mb-12 group shadow-2xl"
              >
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-transparent z-10" />
                <img
                  src={project.coverImage.url}
                  alt={project.title}
                  loading="eager"
                  className="w-full h-65 sm:h-105 lg:h-130 object-cover transition-transform duration-1500 group-hover:scale-105"
                />

                {/* Floating badges */}
                <div className="absolute bottom-6 left-6 z-20 flex flex-wrap gap-3">
                  {project.featured && (
                    <div className="badge badge-warning badge-lg gap-2 px-4 py-4 shadow-lg">
                      <Star size={14} /> Featured
                    </div>
                  )}
                  <div
                    className={`badge badge-lg px-4 py-4 shadow-lg capitalize ${
                      project.status === "completed"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {project.status}
                  </div>
                  {year && (
                    <div className="badge badge-lg px-4 py-4 shadow-lg bg-base-100/90 backdrop-blur border-none text-base-content gap-2">
                      <Calendar size={14} /> {year}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ===== CONTENT GRID ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 sm:gap-10">
              {/* LEFT */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="xl:col-span-2 space-y-8 sm:space-y-10"
              >
                {/* Title block */}
                <motion.div variants={fadeUp}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-5">
                    <FolderKanban size={14} className="text-primary" />
                    <span className="uppercase tracking-[0.2em] text-xs text-primary font-semibold">
                      Project Showcase
                    </span>
                  </div>

                  <h1 className="public-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-5 leading-tight">
                    {project.title}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-base-content/70 leading-relaxed max-w-4xl">
                    {project.description}
                  </p>
                </motion.div>

                {/* Meta row */}
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                  <div className="badge badge-outline gap-2 px-4 py-4">
                    <Eye size={14} /> {project.views || 0} views
                  </div>
                  <div className="badge badge-outline gap-2 px-4 py-4">
                    <Layers3 size={14} /> {project.technologies?.length || 0}{" "}
                    technologies
                  </div>
                  {project.images?.length > 0 && (
                    <div className="badge badge-outline gap-2 px-4 py-4">
                      <ImageIcon size={14} /> {project.images.length}{" "}
                      screenshots
                    </div>
                  )}
                </motion.div>

                {/* Long description */}
                {project.longDescription && (
                  <motion.div
                    variants={fadeUp}
                    className="public-card rounded-4xl"
                  >
                    <div className="card-body p-6 md:p-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <FileText className="text-primary" size={20} />
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-black">
                          Project Overview
                        </h2>
                      </div>

                      <div
                        className="prose prose-lg max-w-none prose-headings:text-base-content prose-p:text-base-content/80 prose-strong:text-primary prose-a:text-primary"
                        dangerouslySetInnerHTML={{
                          __html: project.longDescription,
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Gallery */}
                {project.images?.length > 0 && (
                  <motion.div variants={fadeUp}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <ImageIcon className="text-secondary" size={20} />
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-black">
                        Project Gallery
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {project.images.map((img, i) => (
                        <motion.a
                          key={i}
                          href={img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -4 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 18,
                          }}
                          className="group relative overflow-hidden rounded-3xl border border-base-300 shadow-xl bg-base-200"
                        >
                          <img
                            src={img.url}
                            alt={`${project.title} screenshot ${i + 1}`}
                            loading="lazy"
                            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <span className="text-sm font-medium">
                              Screenshot {i + 1}
                            </span>
                            <ExternalLink size={16} />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* RIGHT SIDEBAR */}
              <motion.aside
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <div className="sticky top-28 space-y-6">
                  {/* Action card */}
                  <div className="public-card rounded-4xl overflow-hidden">
                    <div className="bg-linear-to-r from-primary/20 via-secondary/20 to-primary/20 p-6 border-b border-base-300">
                      <h3 className="text-2xl font-black mb-1">
                        Project Links
                      </h3>
                      <p className="text-sm text-base-content/60">
                        Explore the live project and source code.
                      </p>
                    </div>

                    <div className="card-body p-6 space-y-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn rounded-2xl w-full justify-between border-none text-primary-content hover:brightness-110"
                          style={{
                            background:
                              "linear-gradient(135deg,var(--color-primary),var(--color-secondary))",
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <ExternalLink size={18} /> Live Demo
                          </span>
                          <ChevronRight size={18} />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline rounded-2xl w-full justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <Github size={18} /> GitHub Repository
                          </span>
                          <ChevronRight size={18} />
                        </a>
                      )}

                      {!project.liveUrl && !project.githubUrl && (
                        <p className="text-sm text-base-content/50 text-center py-2">
                          No external links available.
                        </p>
                      )}

                      <div className="divider my-1" />

                      <div className="grid grid-cols-2 gap-3">
                        <div className="public-card bg-base-100 rounded-2xl p-4 text-center">
                          <p className="text-2xl font-black text-primary">
                            {project.views || 0}
                          </p>
                          <p className="text-xs text-base-content/60 mt-1">
                            Views
                          </p>
                        </div>
                        <div className="public-card bg-base-100 rounded-2xl p-4 text-center">
                          <p className="text-2xl font-black text-secondary">
                            {project.technologies?.length || 0}
                          </p>
                          <p className="text-xs text-base-content/60 mt-1">
                            Tech Stack
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tech stack */}
                  {project.technologies?.length > 0 && (
                    <div className="public-card rounded-4xl">
                      <div className="card-body p-6">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Code2 className="text-primary" size={18} />
                          </div>
                          <h3 className="text-xl font-black">Technologies</h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <motion.span
                              key={tech}
                              whileHover={{ y: -3, scale: 1.04 }}
                              className="badge badge-primary badge-lg px-3 py-3 font-medium cursor-default"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project info */}
                  <div className="public-card rounded-4xl">
                    <div className="card-body p-6 space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-base-content/60">Status</span>
                        <span
                          className={`badge capitalize ${
                            project.status === "completed"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      {year && (
                        <div className="flex items-center justify-between">
                          <span className="text-base-content/60">Year</span>
                          <span className="font-semibold">{year}</span>
                        </div>
                      )}
                      {project.featured && (
                        <div className="flex items-center justify-between">
                          <span className="text-base-content/60">
                            Highlight
                          </span>
                          <span className="badge badge-warning gap-1">
                            <Star size={12} /> Featured
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default ProjectDetail;
