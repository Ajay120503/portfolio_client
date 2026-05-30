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
  Quote,
  Building2,
  User,
  Sparkles,
} from "lucide-react";

import { testimonialsAPI } from "../../api";
import { useTestimonials } from "../../hooks/usePortfolioData";
import { ConfirmModal } from "../../components/ui/Modal";
import ImageUpload from "../../components/ui/ImageUpload";

const ManageTestimonials = () => {
  const { data, isLoading } = useTestimonials();
  const testimonials = Array.isArray(data) ? data : data?.data || [];

  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      rating: 5,
      isVisible: true,
      order: 0,
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["testimonials"] });

  const createMut = useMutation({
    mutationFn: testimonialsAPI.create,
    onSuccess: () => {
      toast.success("Testimonial added");
      invalidate();
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to add testimonial"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => testimonialsAPI.update(id, data),
    onSuccess: () => {
      toast.success("Testimonial updated");
      invalidate();
      setEditing(null);
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to update testimonial"),
  });

  const deleteMut = useMutation({
    mutationFn: testimonialsAPI.delete,
    onSuccess: () => {
      toast.success("Testimonial deleted");
      invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete testimonial"),
  });

  const startEdit = (item) => {
    setEditing(item);
    setShowForm(true);
    setValue("name", item.name);
    setValue("role", item.role);
    setValue("company", item.company);
    setValue("message", item.message);
    setValue("rating", item.rating);
    setValue("isVisible", item.isVisible);
    setValue("order", item.order);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    reset({ rating: 5, isVisible: true, order: 0 });
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === "avatar" && v && v[0] instanceof File) {
        formData.append(k, v[0]);
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

  const rating = watch("rating");
  const loading = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-primary" size={28} />
            Manage Testimonials
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            Add and manage client reviews & feedback
          </p>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className={`btn gap-2 shadow-md transition-all ${
            showForm ? "btn-error" : "btn-primary"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Testimonial"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Quote size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editing ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <p className="text-sm text-base-content/60">
                Fill client review details below
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Client Name *</span>
                </label>
                <input
                  {...register("name", { required: true })}
                  className="input input-bordered rounded-xl"
                  placeholder="John Doe"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Role / Position
                  </span>
                </label>
                <input
                  {...register("role")}
                  className="input input-bordered rounded-xl"
                  placeholder="CEO / Founder"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Company</span>
                </label>
                <input
                  {...register("company")}
                  className="input input-bordered rounded-xl"
                  placeholder="Company Name"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Display Order</span>
                </label>
                <input
                  type="number"
                  {...register("order")}
                  className="input input-bordered rounded-xl"
                  placeholder="0 (lowest first)"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Testimonial Message *
                </span>
              </label>
              <textarea
                {...register("message", { required: true })}
                rows={5}
                className="textarea textarea-bordered rounded-xl"
                placeholder="What did the client say about your work?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Rating</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    {...register("rating")}
                    className="range range-primary flex-1"
                  />
                  <span className="font-bold text-primary min-w-7.5 text-lg">
                    {rating}
                  </span>
                </div>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={20}
                      className={
                        n <= rating
                          ? "fill-warning text-warning"
                          : "text-base-300"
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Client Avatar</span>
                </label>
                <ImageUpload
                  name="avatar"
                  register={register}
                  currentImage={editing?.avatar?.url}
                  helperText="Upload client photo (optional)"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-base-200/70 p-4 public-card">
              <div>
                <p className="font-medium">Visible on website</p>
                <p className="text-sm text-base-content/60">
                  Show this testimonial publicly
                </p>
              </div>
              <input
                type="checkbox"
                {...register("isVisible")}
                className="toggle toggle-primary"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary rounded-xl gap-2 px-8"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Check size={16} />
                )}
                {editing ? "Update" : "Save"}
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

      {/* LOADING & EMPTY STATES */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="card bg-base-100/60 backdrop-blur-sm public-card rounded-3xl p-16 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Quote size={42} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No testimonials yet</h3>
          <p className="text-base-content/60 max-w-md mx-auto">
            Add your first client review to build trust and showcase success
            stories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="card bg-base-100/70 backdrop-blur-sm public-card rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex gap-5">
                  {/* Avatar */}
                  <div className="shrink-0">
                    {item.avatar?.url ? (
                      <img
                        src={item.avatar.url}
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-base-300 shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <User size={28} className="text-primary/60" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-base-content/60 mt-0.5">
                          {item.role && <span>{item.role}</span>}
                          {item.company && (
                            <>
                              {item.role && <span>•</span>}
                              <Building2 size={12} />
                              <span>{item.company}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < (item.rating || 5)
                                ? "fill-warning text-warning"
                                : "text-base-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-base-content/70 leading-relaxed mt-4 italic line-clamp-3">
                      “{item.message}”
                    </p>

                    {/* Footer actions */}
                    <div className="flex items-center justify-between mt-5 pt-3 border-t border-base-200">
                      <div>
                        {item.isVisible ? (
                          <span className="badge badge-success gap-1 px-3 py-2 text-xs">
                            <Eye size={12} />
                            Visible
                          </span>
                        ) : (
                          <span className="badge badge-ghost gap-1 px-3 py-2 text-xs">
                            <EyeOff size={12} />
                            Hidden
                          </span>
                        )}
                        {item.order !== undefined && item.order !== 0 && (
                          <span className="badge badge-outline ml-2 px-3 py-2 text-xs">
                            Order: {item.order}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(item)}
                          className="btn btn-xs btn-circle btn-ghost text-base-content/60 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() =>
                            updateMut.mutate({
                              id: item._id,
                              data: { isVisible: !item.isVisible },
                            })
                          }
                          className="btn btn-xs btn-circle btn-ghost text-base-content/60 hover:text-success transition-colors"
                          title={item.isVisible ? "Hide" : "Show"}
                        >
                          {item.isVisible ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteId(item._id)}
                          className="btn btn-xs btn-circle btn-ghost text-base-content/60 hover:text-error transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
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
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </div>
  );
};

export default ManageTestimonials;
