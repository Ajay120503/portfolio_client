import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  BookOpen,
  Clock,
  Eye,
  FileText,
  Inbox,
  Search,
  Tag,
  TrendingUp,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SkeletonCard } from "../../components/ui/Loader";
import { useBlogs, useSettings } from "../../hooks/usePortfolioData";

const Blog = () => {
  const [search, setSearch] = useState("");

  const { data: settings } = useSettings();
  const { data, isLoading } = useBlogs({
    search: search || undefined,
  });

  const blogs = useMemo(() => data?.data || [], [data]);

  const totalViews = useMemo(() => {
    return blogs.reduce((acc, blog) => acc + (blog.views || 0), 0);
  }, [blogs]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Blog | {settings?.siteTitle || "Portfolio"}</title>
      </Helmet>

      <div className="public-page min-h-screen text-base-content overflow-hidden">
        <Navbar />

        {/* HERO SECTION */}
        <section className="public-hero relative pt-20 sm:pt-28 pb-10 sm:pb-14 md:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-7xl mx-auto">
            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-10 md:mb-14"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
                <BookOpen size={40} />
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
                Developer{" "}
                <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Blog
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-base-content/70 leading-relaxed">
                Thoughts, tutorials, cybersecurity insights, and modern web
                development articles crafted with experience and passion.
              </p>
            </motion.div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12"
            >
              <div className="stats public-card">
                <div className="stat py-4">
                  <div className="stat-title">Articles</div>
                  <div className="stat-value text-primary text-3xl">
                    {blogs.length}
                  </div>
                </div>
              </div>

              <div className="stats public-card">
                <div className="stat py-4">
                  <div className="stat-title">Views</div>
                  <div className="stat-value text-secondary text-3xl">
                    {totalViews}
                  </div>
                </div>
              </div>

              <div className="stats public-card">
                <div className="stat py-4">
                  <div className="stat-title">Topics</div>
                  <div className="stat-value text-accent text-3xl">10+</div>
                </div>
              </div>

              <div className="stats public-card">
                <div className="stat py-4">
                  <div className="stat-title">Updated</div>
                  <div className="stat-value text-success text-2xl">Weekly</div>
                </div>
              </div>
            </motion.div>

            {/* SEARCH */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-16"
            >
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/40"
                />

                <input
                  type="text"
                  placeholder="Search articles, tutorials, technologies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input input-bordered input-lg public-input w-full pl-14 shadow-xl"
                />
              </div>
            </motion.div>

            {/* LOADING */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <>
                {/* BLOG GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {blogs.map((post, i) => (
                    <motion.article
                      key={post._id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <div className="public-card public-card-hover rounded-4xl overflow-hidden h-full">
                        {/* IMAGE */}
                        <figure className="relative h-56 overflow-hidden">
                          {post.coverImage?.url ? (
                            <img
                              src={post.coverImage.url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center">
                              <FileText size={64} className="text-primary/60" />
                            </div>
                          )}

                          {/* OVERLAY */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>

                          {/* READ TIME */}
                          <div className="absolute bottom-4 left-4">
                            <div className="badge badge-primary badge-md gap-1 shadow-lg">
                              <Clock size={12} />
                              {post.readTime} min
                            </div>
                          </div>
                        </figure>

                        {/* CONTENT */}
                        <div className="card-body">
                          {/* TAGS */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.tags?.slice(0, 3).map((tag) => (
                              <div
                                key={tag}
                                className="badge badge-outline badge-sm gap-1 py-3"
                              >
                                <Tag size={10} />
                                {tag}
                              </div>
                            ))}
                          </div>

                          {/* TITLE */}
                          <h2 className="card-title text-xl leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                            {post.title}
                          </h2>

                          {/* EXCERPT */}
                          <p className="text-base-content/65 text-sm leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* FOOTER */}
                          <div className="mt-auto pt-5">
                            <div className="flex items-center justify-between text-sm text-base-content/50 mb-4">
                              <div className="flex items-center gap-1">
                                <Eye size={14} />
                                <span>{post.views} views</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <TrendingUp size={14} />
                                <span>Trending</span>
                              </div>
                            </div>

                            <Link
                              to={`/blog/${post.slug}`}
                              className="btn btn-primary w-full rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                            >
                              Read Full Article
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* EMPTY STATE */}
                {!isLoading && blogs.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24"
                  >
                    <div className="max-w-md mx-auto">
                      <Inbox
                        size={72}
                        className="mx-auto mb-6 text-primary/60"
                      />

                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
                        No Articles Found
                      </h2>

                      <p className="text-base-content/60 mb-8">
                        Try searching with different keywords or check back
                        later for new content.
                      </p>

                      <button
                        onClick={() => setSearch("")}
                        className="btn btn-primary rounded-xl px-8"
                      >
                        Clear Search
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Blog;
