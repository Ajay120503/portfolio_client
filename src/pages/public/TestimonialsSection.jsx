import { motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Quote, Star, Building2, Users } from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useSettings } from "../../hooks/usePortfolioData";
import { useTestimonials } from "../../hooks/usePortfolioData";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= rating
              ? "text-primary fill-primary"
              : "text-base-content/20"
          }
        />
      ))}
    </div>
  );
};

export const TestimonialsSection = () => {
  const { data, isLoading } = useTestimonials();

  const testimonials = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <section id="testimonials" className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="public-hero">
      <div className="container mx-auto px-4 relative z-10 mb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20 md:mb-28"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
            <Users size={40} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Client{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Testimonials
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-base-content/70 leading-relaxed">
            What people say about working with me.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
              <Users size={40} className="text-primary/60" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No testimonials yet</h3>
            <p className="text-base-content/60">
              Check back soon for client feedback.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6 }}
                className="group public-card public-card-hover relative bg-base-100/80 backdrop-blur-sm rounded-3xl p-6 flex flex-col gap-4"
              >
                {/* Decorative shine */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Quote icon */}
                <div className="flex items-center justify-between">
                  <Quote size={28} className="text-primary/40" />
                  <StarRating rating={item.rating} />
                </div>

                {/* Message */}
                <p className="text-base-content/70 text-sm leading-relaxed flex-1">
                  "{item.message}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-3 border-t border-base-content/10">
                  {item.avatar?.url ? (
                    <img
                      src={item.avatar.url}
                      alt={item.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-base-300 shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
                      {item.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-primary font-medium">
                      {item.role}
                      {item.company && (
                        <span className="text-base-content/50">
                          {" "}
                          · {item.company}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { data: settings } = useSettings();

  return (
    <HelmetProvider>
      <Helmet>
        <title>Testimonials | {settings?.siteTitle || "Portfolio"}</title>
        <meta
          name="description"
          content="Client testimonials and feedback about my work"
        />
      </Helmet>

      <div className="public-page min-h-screen text-base-content">
        <Navbar />
        <main className="pt-10">
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Testimonials;
