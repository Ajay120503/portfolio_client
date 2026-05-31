import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Tag,
  Share2,
  Bookmark,
  FileQuestion,
  Newspaper,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { useBlogBySlug, useSettings } from "../../hooks/usePortfolioData";

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useBlogBySlug(slug);
  const { data: settings } = useSettings();

  /* LOADING STATE */
  if (isLoading) {
    return (
      <div className="public-page min-h-screen">
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-screen gap-5">
          <span className="loading loading-spinner loading-lg text-primary"></span>

          <p className="text-base-content/60 animate-pulse">
            Loading amazing article...
          </p>
        </div>
      </div>
    );
  }

  /* NOT FOUND */
  if (!post) {
    return (
      <div className="public-page min-h-screen">
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <FileQuestion size={76} className="mb-5 text-primary/60" />

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">
            Post Not Found
          </h2>

          <p className="text-base-content/60 max-w-md mb-8">
            The article you are looking for may have been removed or the URL
            might be incorrect.
          </p>

          <Link to="/blog" className="btn btn-primary rounded-xl px-8">
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>
          {post.title} | {settings?.siteTitle || "Portfolio"}
        </title>

        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="public-page min-h-screen text-base-content overflow-hidden">
        <Navbar />

        {/* HERO SECTION */}
        <section className="public-hero relative pt-10 pb-10 sm:pb-12 md:pb-14 px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-5xl mx-auto">
            {/* BACK BUTTON */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link
                to="/blog"
                className="btn btn-ghost rounded-xl gap-2 hover:bg-base-200"
              >
                <ArrowLeft size={18} />
                Back to Blog
              </Link>
            </motion.div>

            {/* ARTICLE */}
            <motion.article
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* COVER IMAGE */}
              {post.coverImage?.url && (
                <div className="public-image-frame relative rounded-4xl overflow-hidden mb-10">
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="w-full h-60 sm:h-87.5 lg:h-112.5 object-cover"
                  />

                  {/* IMAGE OVERLAY */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>

                  {/* FLOATING BADGE */}
                  <div className="absolute bottom-5 left-5">
                    <div className="badge badge-primary badge-lg gap-2 px-4 py-4 shadow-xl">
                      <Newspaper size={14} />
                      Featured Article
                    </div>
                  </div>
                </div>
              )}

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {post.tags?.map((tag) => (
                  <div
                    key={tag}
                    className="badge badge-outline badge-lg gap-2 px-4 py-3"
                  >
                    <Tag size={12} />
                    {tag}
                  </div>
                ))}
              </div>

              {/* TITLE */}
              <h1 className="public-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6">
                <span className="public-gradient-text">{post.title}</span>
              </h1>

              {/* EXCERPT */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-base-content/70 leading-relaxed mb-6 sm:mb-8 max-w-4xl">
                {post.excerpt}
              </p>

              {/* META INFO */}
              <div className=" public-card rounded-2xl flex flex-wrap items-center justify-between gap-4 sm:gap-5 mb-8 sm:mb-10 p-5 sm:p-8">
                <div className="flex flex-wrap gap-5 text-sm text-base-content/60">
                  {post.publishedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {post.readTime} min read
                  </div>

                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    {post.views} views
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3">
                  <button className="btn btn-outline btn-sm rounded-xl gap-2">
                    <Bookmark size={15} />
                    Save
                  </button>

                  <button className="btn btn-primary btn-sm rounded-xl gap-2">
                    <Share2 size={15} />
                    Share
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="public-card rounded-4xl">
                <div className="card-body p-6 sm:p-10 lg:p-14">
                  <div
                    className="
                      prose 
                      prose-lg 
                      max-w-none
                      prose-headings:text-base-content
                      prose-p:text-base-content/80
                      prose-strong:text-base-content
                      prose-code:text-primary
                      prose-pre:bg-neutral
                      prose-pre:text-neutral-content
                      prose-blockquote:border-primary
                      prose-blockquote:bg-base-300/40
                      prose-blockquote:rounded-xl
                      prose-a:text-primary
                      prose-img:rounded-2xl
                      prose-li:text-base-content/80
                    "
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* AUTHOR / CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-16"
              >
                <div className="public-card rounded-4xl">
                  <div className="card-body text-center py-12">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
                      Enjoyed this article?
                    </h3>

                    <p className="text-base-content/70 max-w-2xl mx-auto mb-8">
                      Explore more tutorials, cybersecurity insights, and modern
                      web development content on the blog.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                      <Link
                        to="/blog"
                        className="btn btn-primary rounded-xl px-8"
                      >
                        Explore More Articles
                      </Link>

                      <Link
                        to="/contact"
                        className="btn btn-outline rounded-xl px-8"
                      >
                        Contact Me
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.article>
          </div>
        </section>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default BlogPost;
