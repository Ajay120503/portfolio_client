import { useId, useMemo, useState } from "react";
import { Image, Upload, X } from "lucide-react";

const ImageUpload = ({
  name,
  register,
  currentImage,
  label,
  accept = "image/*",
  multiple = false,
  helperText = "PNG, JPG, WebP, GIF or SVG up to 50MB.",
  className = "",
}) => {
  const inputId = useId();
  const [previews, setPreviews] = useState([]);
  const registered = register ? register(name) : {};

  const currentImages = useMemo(() => {
    if (!currentImage) return [];
    return Array.isArray(currentImage) ? currentImage.filter(Boolean) : [currentImage];
  }, [currentImage]);

  const handleChange = (event) => {
    const files = Array.from(event.target.files || []);

    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setPreviews(
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    );

    registered.onChange?.(event);
  };

  const clearSelection = () => {
    const input = document.getElementById(inputId);
    if (input) input.value = "";
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setPreviews([]);
  };

  const imagesToShow = previews.length > 0 ? previews : currentImages.map((url) => ({ url }));

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="label py-0">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}

      <label
        htmlFor={inputId}
        className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-base-300 bg-base-200/50 p-5 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
      >
        {imagesToShow.length > 0 ? (
          <div className="grid w-full grid-cols-2 gap-3">
            {imagesToShow.slice(0, multiple ? 4 : 1).map((preview, index) => (
              <div
                key={`${preview.url}-${index}`}
                className="relative aspect-video overflow-hidden rounded-2xl bg-base-300"
              >
                <img
                  src={preview.url}
                  alt={preview.name || "Selected upload"}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Image size={26} />
            </div>
            <p className="font-semibold">Upload image</p>
            <p className="mt-1 text-sm text-base-content/50">{helperText}</p>
          </div>
        )}

        <span className="btn btn-primary btn-sm mt-4 rounded-xl gap-2">
          <Upload size={16} />
          {imagesToShow.length > 0 ? "Replace" : "Choose file"}
        </span>
      </label>

      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        name={registered.name || name}
        ref={registered.ref}
        onBlur={registered.onBlur}
        onChange={handleChange}
      />

      {previews.length > 0 && (
        <button
          type="button"
          onClick={clearSelection}
          className="btn btn-ghost btn-sm rounded-xl text-error"
        >
          <X size={15} />
          Clear selected file{previews.length > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
