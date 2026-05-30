import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  User,
  Sparkles,
  Code2,
  Eye,
  FileJson,
} from "lucide-react";

import { aboutAPI } from "../../api";
import { useAbout } from "../../hooks/usePortfolioData";
import { ConfirmModal } from "../../components/ui/Modal";
import ImageUpload from "../../components/ui/ImageUpload";
import RichTextEditor from "../../components/ui/RichTextEditor";

const ManageAbout = () => {
  const { data, isLoading } = useAbout();

  const about = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : data
    ? [data]
    : [];

  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [previewJson, setPreviewJson] = useState({
    highlights: false,
    personalDetails: false,
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["about"] });

  const createMut = useMutation({
    mutationFn: aboutAPI.create,
    onSuccess: () => {
      toast.success("About section added!");
      invalidate();
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to create"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => aboutAPI.update(id, data),
    onSuccess: () => {
      toast.success("Updated successfully!");
      invalidate();
      setEditing(null);
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to update"),
  });

  const deleteMut = useMutation({
    mutationFn: aboutAPI.delete,
    onSuccess: () => {
      toast.success("Deleted successfully!");
      invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const startEdit = (item) => {
    setEditing(item);
    setShowForm(true);

    setValue("heading", item.heading || "");
    setValue("subheading", item.subheading || "");
    setValue("bio", item.bio || "");
    setValue(
      "funFacts",
      Array.isArray(item.funFacts)
        ? item.funFacts.join(", ")
        : item.funFacts || ""
    );
    setValue(
      "highlights",
      item.highlights ? JSON.stringify(item.highlights, null, 2) : ""
    );
    setValue(
      "personalDetails",
      item.personalDetails ? JSON.stringify(item.personalDetails, null, 2) : ""
    );
  };

  const onSubmit = (form) => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "profileImage" && value && value[0] instanceof File) {
        formData.append(key, value[0]);
      } else if (key === "funFacts") {
        const facts = value
          ?.split(",")
          .map((f) => f.trim())
          .filter(Boolean);
        formData.append(key, JSON.stringify(facts));
      } else if (key === "highlights" || key === "personalDetails") {
        try {
          const parsed = JSON.parse(value || "[]");
          formData.append(key, JSON.stringify(parsed));
        } catch {
          toast.error(`${key} must be valid JSON`);
          throw new Error("Invalid JSON");
        }
      } else {
        formData.append(key, value ?? "");
      }
    });

    if (editing) {
      updateMut.mutate({ id: editing._id, data: formData });
    } else {
      createMut.mutate(formData);
    }
  };

  const bioContent = watch("bio");
  const highlightsRaw = watch("highlights");
  const personalDetailsRaw = watch("personalDetails");

  // Helper to format JSON nicely
  const formatJson = (field) => {
    const raw = field === "highlights" ? highlightsRaw : personalDetailsRaw;
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setValue(field, JSON.stringify(parsed, null, 2));
      toast.success("JSON formatted!");
    } catch {
      toast.error("Invalid JSON, cannot format");
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <User className="text-primary" size={28} />
            Manage About
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            Customize your portfolio about section – tell your story.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            reset();
          }}
          className={`btn gap-2 shadow-md transition-all ${
            showForm ? "btn-error" : "btn-primary"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add About"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {editing ? <Pencil size={20} /> : <Plus size={20} />}
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editing ? "Edit About" : "Create About"}
              </h3>
              <p className="text-sm text-base-content/60">
                Fill your portfolio about details
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Heading *</span>
                </label>
                <input
                  {...register("heading", { required: true })}
                  className="input input-bordered w-full bg-base-200/40 rounded-xl"
                  placeholder="e.g., Creative Developer"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Subheading</span>
                </label>
                <input
                  {...register("subheading")}
                  className="input input-bordered w-full bg-base-200/40 rounded-xl"
                  placeholder="Full Stack Developer with 8+ years experience"
                />
              </div>
            </div>

            {/* Bio with Rich Text */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Bio (Rich Text)</span>
              </label>
              <RichTextEditor
                value={bioContent}
                onChange={(content) => setValue("bio", content)}
                placeholder="Write your professional bio..."
              />
            </div>

            {/* Profile Image */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Profile Image</span>
              </label>
              <ImageUpload
                name="profileImage"
                register={register}
                currentImage={editing?.profileImage?.url}
              />
            </div>

            {/* JSON Fields with formatting helpers */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label flex justify-between">
                  <span className="label-text font-medium">
                    Highlights (JSON)
                  </span>
                  <button
                    type="button"
                    onClick={() => formatJson("highlights")}
                    className="btn btn-xs btn-ghost gap-1"
                  >
                    <FileJson size={12} />
                    Format JSON
                  </button>
                </label>
                <textarea
                  {...register("highlights")}
                  rows={8}
                  className="textarea textarea-bordered w-full bg-base-200/40 font-mono text-sm rounded-xl"
                  placeholder={`[
  {
    "icon": "🏆",
    "label": "Projects Completed",
    "value": "50+"
  },
  {
    "icon": "⭐",
    "label": "Happy Clients",
    "value": "120+"
  }
]`}
                />
                <p className="text-xs text-base-content/50 mt-1">
                  Array of objects with icon, label, value
                </p>
              </div>

              <div className="form-control">
                <label className="label flex justify-between">
                  <span className="label-text font-medium">
                    Personal Details (JSON)
                  </span>
                  <button
                    type="button"
                    onClick={() => formatJson("personalDetails")}
                    className="btn btn-xs btn-ghost gap-1"
                  >
                    <FileJson size={12} />
                    Format JSON
                  </button>
                </label>
                <textarea
                  {...register("personalDetails")}
                  rows={8}
                  className="textarea textarea-bordered w-full bg-base-200/40 font-mono text-sm rounded-xl"
                  placeholder={`[
  {
    "key": "Location",
    "value": "San Francisco, CA"
  },
  {
    "key": "Email",
    "value": "hello@example.com"
  }
]`}
                />
                <p className="text-xs text-base-content/50 mt-1">
                  Array of objects with key and value
                </p>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Fun Facts (comma separated)
                </span>
              </label>
              <input
                {...register("funFacts")}
                className="input input-bordered w-full bg-base-200/40 rounded-xl"
                placeholder="Coffee addict, Open source contributor, Guitar player"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={createMut.isPending || updateMut.isPending}
              className="btn btn-primary w-full gap-2 rounded-xl shadow-lg"
            >
              {createMut.isPending || updateMut.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Check size={18} />
              )}
              {editing ? "Update About" : "Create About"}
            </button>
          </form>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : about.length === 0 ? (
        /* EMPTY STATE */
        <div className="card bg-base-100/60 backdrop-blur-sm public-card rounded-3xl p-16 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <User size={42} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No About Section Yet</h3>
          <p className="text-base-content/60 max-w-md mx-auto mb-6">
            Create your portfolio about section and tell visitors about
            yourself.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary gap-2"
          >
            <Plus size={18} />
            Create About Section
          </button>
        </div>
      ) : (
        /* CARDS LIST */
        <div className="space-y-6">
          {about.map((item) => (
            <div
              key={item._id}
              className="card bg-base-100/70 backdrop-blur-sm public-card rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6 flex flex-col lg:flex-row gap-6">
                {/* Image */}
                <div className="shrink-0">
                  {item?.profileImage?.url ? (
                    <img
                      src={item.profileImage.url}
                      alt={item.heading}
                      className="w-32 h-32 rounded-2xl object-cover border-2 border-base-300 shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <User size={48} className="text-primary" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">
                      {item.heading || "About Me"}
                    </h3>
                    <span className="badge badge-primary badge-sm">Active</span>
                  </div>
                  <p className="text-primary font-medium mb-3">
                    {item.subheading}
                  </p>

                  {/* Bio preview */}
                  <div
                    className="prose prose-sm max-w-none text-base-content/70 line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{ __html: item.bio || "" }}
                  />

                  {/* Stats chips */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    {item.highlights?.length > 0 && (
                      <div className="badge badge-outline gap-1">
                        <Code2 size={12} /> {item.highlights.length} highlights
                      </div>
                    )}
                    {item.personalDetails?.length > 0 && (
                      <div className="badge badge-outline gap-1">
                        <User size={12} /> {item.personalDetails.length} details
                      </div>
                    )}
                    {item.funFacts?.length > 0 && (
                      <div className="badge badge-outline gap-1">
                        <Sparkles size={12} /> {item.funFacts.length} fun facts
                      </div>
                    )}
                  </div>

                  {/* Fun facts tags */}
                  {item.funFacts?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.funFacts.slice(0, 3).map((fact, i) => (
                        <span
                          key={i}
                          className="badge badge-secondary badge-sm gap-1"
                        >
                          <Sparkles size={10} />
                          {fact}
                        </span>
                      ))}
                      {item.funFacts.length > 3 && (
                        <span className="badge badge-ghost badge-sm">
                          +{item.funFacts.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2 justify-end">
                  <button
                    onClick={() => startEdit(item)}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="btn btn-error btn-outline btn-sm gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMut.mutate(deleteId)}
        loading={deleteMut.isPending}
        title="Delete About Section"
        message="Are you sure you want to delete this about section? This action cannot be undone."
      />
    </div>
  );
};

export default ManageAbout;
