import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const SectionWrapper = ({ children, id, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`section-padding ${className}`}
    >
      {children}
    </motion.section>
  );
};

export const SectionHeader = ({ title, subtitle, align = "center" }) => {
  const alignClass = align === "center" ? "text-center" : "text-left";
  return (
    <div className={`mb-12 ${alignClass}`}>
      <h2 className={`section-title gradient-text`}>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionWrapper;
