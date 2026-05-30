const Badge = ({ children, variant = "primary", size = "sm" }) => {
  const variants = {
    primary: "badge-primary",
    secondary: "badge-secondary",
    accent: "badge-accent",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    ghost: "badge-ghost",
    outline: "badge-outline",
  };
  const sizes = {
    xs: "badge-xs",
    sm: "badge-sm",
    md: "badge-md",
    lg: "badge-lg",
  };

  return (
    <span className={`badge ${variants[variant]} ${sizes[size]} font-medium`}>
      {children}
    </span>
  );
};

export default Badge;
