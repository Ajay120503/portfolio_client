const Loader = ({ size = "md", text = "Loading..." }) => {
  const sizes = { sm: "loading-sm", md: "loading-md", lg: "loading-lg" };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <span
        className={`loading loading-spinner ${sizes[size]} text-primary`}
      ></span>
      {text && <p className="text-base-content/60 text-sm">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-100">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      <p className="text-base-content/60">Loading...</p>
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="card bg-base-200 animate-pulse">
    <div className="h-48 bg-base-300 rounded-t-2xl"></div>
    <div className="card-body gap-3">
      <div className="h-4 bg-base-300 rounded w-3/4"></div>
      <div className="h-3 bg-base-300 rounded w-full"></div>
      <div className="h-3 bg-base-300 rounded w-5/6"></div>
      <div className="flex gap-2 mt-2">
        <div className="h-6 w-16 bg-base-300 rounded-full"></div>
        <div className="h-6 w-16 bg-base-300 rounded-full"></div>
      </div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-3 bg-base-300 rounded ${
          i === lines - 1 ? "w-4/5" : "w-full"
        }`}
      ></div>
    ))}
  </div>
);

export default Loader;
