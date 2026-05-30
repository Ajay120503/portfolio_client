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
  Sparkles,
  DollarSign,
  Layers3,
  Tag,
  Star,
} from "lucide-react";

import { servicesAPI } from "../../api";
import { useServices } from "../../hooks/usePortfolioData";
import { ConfirmModal } from "../../components/ui/Modal";

const ManageServices = () => {
  const { data: services, isLoading } = useServices();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      order: 0,
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["services"] });

  const createMut = useMutation({
    mutationFn: servicesAPI.create,
    onSuccess: () => {
      toast.success("Service added successfully");
      invalidate();
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to add service"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => servicesAPI.update(id, data),
    onSuccess: () => {
      toast.success("Service updated successfully");
      invalidate();
      setEditing(null);
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to update service"),
  });

  const deleteMut = useMutation({
    mutationFn: servicesAPI.delete,
    onSuccess: () => {
      toast.success("Service deleted");
      invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete service"),
  });

  const startEdit = (item) => {
    setEditing(item);
    setShowForm(true);
    setValue("title", item.title);
    setValue("icon", item.icon);
    setValue("description", item.description);
    setValue("features", item.features.join(", "));
    setValue("price", item.price);
    setValue("order", item.order);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    reset({ order: 0 });
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "features") {
        formData.append(
          key,
          JSON.stringify(
            value
              ?.split(",")
              .map((f) => f.trim())
              .filter(Boolean) || []
          )
        );
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

  const loading = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-primary" size={28} />
            Manage Services
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            Create, edit, and organize your offered services.
          </p>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className={`btn gap-2 shadow-md transition-all ${
            showForm ? "btn-error" : "btn-primary"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Service"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editing ? "Edit Service" : "Add Service"}
              </h3>
              <p className="text-sm text-base-content/60">
                Fill all service details below
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Service Title *
                  </span>
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className={`input input-bordered rounded-xl ${
                    errors.title ? "input-error" : ""
                  }`}
                  placeholder="e.g., Web Development"
                />
                {errors.title && (
                  <span className="text-error text-xs mt-1">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Icon (Emoji)</span>
                </label>
                <input
                  {...register("icon")}
                  className="input input-bordered rounded-xl"
                  placeholder="🚀"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Price</span>
                </label>
                <div className="relative">
                  <DollarSign
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                  />
                  <input
                    {...register("price")}
                    type="number"
                    step="0.01"
                    className="input input-bordered rounded-xl w-full pl-10"
                    placeholder="499.99"
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Display Order</span>
                </label>
                <div className="relative">
                  <Layers3
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                  />
                  <input
                    {...register("order")}
                    type="number"
                    className="input input-bordered rounded-xl w-full pl-10"
                    placeholder="0 (lowest first)"
                  />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="textarea textarea-bordered rounded-xl w-full"
                placeholder="Describe what this service includes..."
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Features</span>
              </label>
              <input
                {...register("features")}
                className="input input-bordered rounded-xl w-full"
                placeholder="Responsive Design, SEO Optimization, API Integration"
              />
              <p className="text-xs text-base-content/50 mt-1">
                Separate features with commas
              </p>
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

      {/* LOADING */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : services?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((item) => (
            <div
              key={item._id}
              className="card bg-base-100/70 backdrop-blur-sm public-card rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {item.icon || "✨"}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      {item.price && (
                        <span className="badge badge-primary badge-sm gap-1">
                          <DollarSign size={12} />
                          {item.price}
                        </span>
                      )}
                      {item.order !== undefined && item.order !== 0 && (
                        <span className="badge badge-ghost badge-sm gap-1">
                          <Layers3 size={10} />
                          Order: {item.order}
                        </span>
                      )}
                    </div>
                    <p className="text-base-content/70 text-sm leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Features badges */}
                    {item.features?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.features.slice(0, 4).map((feature, i) => (
                          <span
                            key={i}
                            className="badge badge-outline badge-primary rounded-full px-3 py-2 text-xs"
                          >
                            <Tag size={10} className="mr-1" />
                            {feature}
                          </span>
                        ))}
                        {item.features.length > 4 && (
                          <span className="badge badge-ghost px-3 py-2 text-xs">
                            +{item.features.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="btn btn-xs btn-circle btn-ghost text-base-content/60 hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
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
          ))}
        </div>
      ) : (
        <div className="card bg-base-100/60 backdrop-blur-sm public-card rounded-3xl p-16 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={42} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No services added yet</h3>
          <p className="text-base-content/60 max-w-md mx-auto">
            Add your first service offering to showcase what you provide.
          </p>
        </div>
      )}

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMut.mutate(deleteId)}
        loading={deleteMut.isPending}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
      />
    </div>
  );
};

export default ManageServices;
