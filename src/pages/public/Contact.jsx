import { motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";

import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Send,
  Mail,
  MessageSquare,
  ShieldCheck,
  Clock3,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import toast from "react-hot-toast";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import { useProfile, useSettings } from "../../hooks/usePortfolioData";

import { contactAPI } from "../../api";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Invalid email address"),

  subject: z.string().min(3, "Subject must be at least 3 characters"),

  message: z.string().min(10, "Message must be at least 10 characters"),
});

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

const Contact = () => {
  const { data: profile } = useProfile();
  const { data: settings } = useSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await contactAPI.submit(data);

      toast.success("Message sent successfully! I'll get back to you soon.");

      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const socialLinks = profile?.socialLinks
    ? Object.entries(profile.socialLinks).filter(([, url]) => url)
    : [];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Contact | {settings?.siteTitle || "Portfolio"}</title>
      </Helmet>

      <div className="public-page min-h-screen text-base-content overflow-hidden">
        <Navbar />

        {/* HERO SECTION */}
        <section className="public-hero relative pt-10 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-7xl mx-auto">
            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-12 md:mb-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6">
                <MessageSquare size={40} />
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
                <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Get In Touch
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-base-content/70 leading-relaxed">
                Have a project idea, collaboration opportunity, or just want to
                say hello? I’d love to hear from you.
              </p>
            </motion.div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-start">
              {/* LEFT SIDE */}
              <motion.div
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                {/* INFO CARD */}
                <div className="public-card rounded-4xl">
                  <div className="card-body p-8">
                    <h2 className="text-3xl font-bold mb-4">Let’s Talk 👋</h2>

                    <p className="text-base-content/70 leading-relaxed mb-8">
                      I’m always open to discussing new opportunities, freelance
                      projects, innovative ideas, or partnerships in web
                      development and cybersecurity.
                    </p>

                    {/* QUICK INFO */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-base-100 public-card">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <Mail size={22} />
                        </div>

                        <div>
                          <p className="text-sm text-base-content/50">
                            Email Response
                          </p>

                          <p className="font-semibold">Within 24 Hours</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-base-100 public-card">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                          <ShieldCheck size={22} />
                        </div>

                        <div>
                          <p className="text-sm text-base-content/50">
                            Secure Communication
                          </p>

                          <p className="font-semibold">
                            Your data stays private
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-base-100 public-card">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                          <Clock3 size={22} />
                        </div>

                        <div>
                          <p className="text-sm text-base-content/50">
                            Availability
                          </p>

                          <p className="font-semibold">Open for Projects</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SOCIAL LINKS */}
                <div className="public-card rounded-4xl">
                  <div className="card-body p-8">
                    <h3 className="text-2xl font-bold mb-6">Connect With Me</h3>

                    <div className="space-y-4">
                      {socialLinks.map(([platform, url]) => {
                        const Icon = socialIcons[platform];

                        if (!Icon) return null;

                        return (
                          <motion.a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-2xl public-card bg-base-100"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                              <Icon size={22} />
                            </div>

                            <div className="flex-1 overflow-hidden">
                              <p className="font-semibold capitalize">
                                {platform}
                              </p>

                              <p className="text-sm text-base-content/50 truncate">
                                {url}
                              </p>
                            </div>
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CONTACT FORM */}
              <motion.div
                initial={{ opacity: 0, x: 35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="public-card rounded-4xl">
                  <div className="card-body p-8 sm:p-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <MessageSquare size={28} />
                      </div>

                      <div>
                        <h2 className="text-3xl font-bold">Send Message</h2>

                        <p className="text-base-content/60">
                          Fill the form below
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* NAME + EMAIL */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Your Name
                            </span>
                          </label>

                          <input
                            {...register("name")}
                            type="text"
                            placeholder="John Doe"
                            className={`input input-bordered public-input h-14 w-full ${
                              errors.name
                                ? "input-error"
                                : "focus:border-primary"
                            }`}
                          />

                          {errors.name && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.name.message}
                              </span>
                            </label>
                          )}
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Email Address
                            </span>
                          </label>

                          <input
                            {...register("email")}
                            type="email"
                            placeholder="john@example.com"
                            className={`input input-bordered public-input h-14 w-full ${
                              errors.email
                                ? "input-error"
                                : "focus:border-primary"
                            }`}
                          />

                          {errors.email && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.email.message}
                              </span>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* SUBJECT */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Subject
                          </span>
                        </label>

                        <input
                          {...register("subject")}
                          type="text"
                          placeholder="Project Discussion"
                          className={`input input-bordered public-input h-14 w-full ${
                            errors.subject
                              ? "input-error"
                              : "focus:border-primary"
                          }`}
                        />

                        {errors.subject && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.subject.message}
                            </span>
                          </label>
                        )}
                      </div>

                      {/* MESSAGE */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Message
                          </span>
                        </label>

                        <textarea
                          {...register("message")}
                          rows={7}
                          placeholder="Tell me about your project..."
                          className={`textarea textarea-bordered public-input w-full ${
                            errors.message
                              ? "textarea-error"
                              : "focus:border-primary"
                          }`}
                        />

                        {errors.message && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.message.message}
                            </span>
                          </label>
                        )}
                      </div>

                      {/* SUBMIT BUTTON */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full h-14 rounded-2xl text-base font-semibold border-none shadow-xl hover:scale-[1.01] transition-all duration-300"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Contact;
