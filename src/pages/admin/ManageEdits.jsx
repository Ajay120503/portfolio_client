// src/pages/admin/ManageEdits.jsx
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
  Eye,
  EyeOff,
  Star,
  StarOff,
  CalendarDays,
  Tag,
  FolderOpen,
  Sparkles,
  Layers,
  Video,
  Wrench,
} from "lucide-react";

import { editsAPI } from "../../api";
import { useAllEdits } from "../../hooks/usePortfolioData";
import { ConfirmModal } from "../../components/ui/Modal";
import ImageUpload from "../../components/ui/ImageUpload";

const CATEGORIES = ["photo", "video", "reel", "before-after", "other"];

const ManageEdits = () => {
  const { data, isLoading } = useAllEdits();
  const edits = Array.isArray(data) ? data : [];

  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "photo",
      tags: "",
      tools: "",
      isVisible: true,
      isFeatured: false,
    },
  });

  const selectedCategory = watch("category");

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["edits-admin"] });

  const createMut = useMutation({
    mutationFn: editsAPI.create,
    onSuccess: () => {
      toast.success("Edit created");
      invalidate();
      setShowForm(false);
      reset();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => editsAPI.update(id, data),
    onSuccess: () => {
      toast.success("Edit updated");
      invalidate();
      setEditing(null);
      setShowForm(false);
      reset();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update"),
  });

  const deleteMut = useMutation({
    mutationFn: editsAPI.delete,
    onSuccess: () => {
      toast.success("Edit deleted");
      invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const startEdit = (item) => {
    setEditing(item);
    setShowForm(true);
    setValue("title", item.title || "");
    setValue("description", item.description || "");
    setValue("category", item.category || "photo");
    setValue("tags", item.tags?.join(", ") || "");
    setValue("tools", item.tools?.join(", ") || "");
    setValue("isVisible", item.isVisible ?? true);
    setValue("isFeatured", item.isFeatured ?? false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    reset();
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v instanceof FileList && v[0] instanceof File) {
        formData.append(k, v[0]);
      } else if (k === "tags" || k === "tools") {
        formData.append(k, v);
      } else if (typeof v === "boolean") {
        formData.append(k, v);
      } else {
        formData.append(k, v ?? "");
      }
    });
    if (editing) {
      updateMut.mutate({ id: editing._id, data: formData });
    } else {
      createMut.mutate(formData);
    }
  };

  const toggleVisible = (item) => {
    const fd = new FormData();
    fd.append("isVisible", !item.isVisible);
    updateMut.mutate({ id: item._id, data: fd });
  };

  const toggleFeatured = (item) => {
    const fd = new FormData();
    fd.append("isFeatured", !item.isFeatured);
    updateMut.mutate({ id: item._id, data: fd });
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-primary" size={28} />
            Manage Edits
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            Showcase your creative photo and video edits
          </p>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className={`btn gap-2 shadow-md transition-all ${
            showForm ? "btn-error" : "btn-primary"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "New Edit"}
        </button>
      </div>

      {/* INLINE FORM */}
      {showForm && (
        <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editing ? "Edit Edit" : "Add New Edit"}
              </h3>
              <p className="text-sm text-base-content/60">
                Fill in the details below
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Title *</span>
                </label>
                <input
                  {...register("title", { required: true })}
                  className="input input-bordered rounded-xl"
                  placeholder="Edit title"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Category</span>
                </label>
                <select
                  {...register("category")}
                  className="select select-bordered rounded-xl"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                {...register("description")}
                rows={2}
                className="textarea textarea-bordered rounded-xl"
                placeholder="Short description..."
              />
            </div>

            {selectedCategory !== "before-after" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Main Media {!editing && "*"}
                  </span>
                </label>
                <ImageUpload
                  name="media"
                  register={register}
                  accept="image/*,video/*"
                  helperText="Upload image or video"
                />
              </div>
            )}

            {(selectedCategory === "video" || selectedCategory === "reel") && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Video Thumbnail (optional)
                  </span>
                </label>
                <ImageUpload
                  name="thumbnail"
                  register={register}
                  accept="image/*"
                  helperText="Custom thumbnail for video"
                />
              </div>
            )}

            {selectedCategory === "before-after" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Before Image *
                    </span>
                  </label>
                  <ImageUpload
                    name="beforeImage"
                    register={register}
                    accept="image/*"
                    currentImage={editing?.beforeImage?.url}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      After Image *
                    </span>
                  </label>
                  <ImageUpload
                    name="afterImage"
                    register={register}
                    accept="image/*"
                    currentImage={editing?.afterImage?.url}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-1">
                    <Tag size={13} /> Tags
                  </span>
                </label>
                <input
                  {...register("tags")}
                  className="input input-bordered rounded-xl"
                  placeholder="portrait, nature, ..."
                />
                <p className="text-xs text-base-content/50 mt-1">
                  Comma separated
                </p>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-1">
                    <Wrench size={13} /> Tools
                  </span>
                </label>
                <input
                  {...register("tools")}
                  className="input input-bordered rounded-xl"
                  placeholder="Photoshop, Lightroom, ..."
                />
                <p className="text-xs text-base-content/50 mt-1">
                  Comma separated
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="font-medium">Visible</span>
                <input
                  type="checkbox"
                  {...register("isVisible")}
                  className="toggle toggle-primary"
                />
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="font-medium">Featured</span>
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="toggle toggle-warning"
                />
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createMut.isPending || updateMut.isPending}
                className="btn btn-primary rounded-xl gap-2 px-8"
              >
                {createMut.isPending || updateMut.isPending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <Check size={16} />
                )}
                {editing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="btn btn-ghost rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LOADING / EMPTY */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : edits.length === 0 ? (
        <div className="card bg-base-100/60 backdrop-blur-sm public-card rounded-3xl p-16 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Layers size={42} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Edits Yet</h3>
          <p className="text-base-content/60 max-w-md mx-auto">
            Start by adding your first photo or video edit.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {edits.map((item) => (
            <div
              key={item._id}
              className="card bg-base-100/70 backdrop-blur-sm public-card rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Media preview */}
              <div className="relative h-52 overflow-hidden bg-base-200">
                {item.category === "before-after" ? (
                  <img
                    src={item.afterImage?.url || item.beforeImage?.url}
                    className="w-full h-full object-cover"
                    alt={item.title}
                  />
                ) : item.mediaType === "video" ? (
                  item.media?.thumbnail ? (
                    <img
                      src={item.media.thumbnail}
                      className="w-full h-full object-cover"
                      alt={item.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video size={32} className="text-base-content/30" />
                    </div>
                  )
                ) : (
                  <img
                    src={item.media?.url}
                    className="w-full h-full object-cover"
                    alt={item.title}
                  />
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.isFeatured && (
                    <span className="badge badge-warning gap-1 shadow-md">
                      <Star size={12} fill="currentColor" /> Featured
                    </span>
                  )}
                  <span
                    className={`badge ${
                      item.isVisible ? "badge-success" : "badge-ghost"
                    } shadow-sm`}
                  >
                    {item.isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="badge badge-outline badge-sm capitalize">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {(item.tags?.length > 0 || item.tools?.length > 0) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-outline badge-primary gap-1"
                      >
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                    {item.tools?.slice(0, 3).map((tool) => (
                      <span key={tool} className="badge badge-outline gap-1">
                        <Wrench size={10} /> {tool}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4 text-xs text-base-content/50">
                  <span>👁 {item.views} views</span>
                  <span>❤️ {item.likes} likes</span>
                  <span>
                    📅 {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-base-200">
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(item)}
                      className="btn btn-xs btn-ghost gap-1 hover:text-primary"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(item._id)}
                      className="btn btn-xs btn-ghost gap-1 hover:text-error"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleVisible(item)}
                      className="btn btn-xs btn-circle btn-ghost"
                      title={item.isVisible ? "Hide" : "Show"}
                    >
                      {item.isVisible ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => toggleFeatured(item)}
                      className="btn btn-xs btn-circle btn-ghost"
                      title={item.isFeatured ? "Unfeature" : "Feature"}
                    >
                      {item.isFeatured ? (
                        <Star size={14} className="text-warning fill-warning" />
                      ) : (
                        <StarOff size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMut.mutate(deleteId)}
        loading={deleteMut.isPending}
        title="Delete Edit"
        message="Are you sure you want to delete this edit? This action cannot be undone."
      />
    </div>
  );
};

export default ManageEdits;
