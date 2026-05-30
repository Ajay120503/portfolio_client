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
  Building2,
  CalendarDays,
  MapPin,
  Briefcase,
  Code2,
  Award,
} from "lucide-react";

import { experienceAPI } from "../../api";
import { useExperience } from "../../hooks/usePortfolioData";
import { ConfirmModal } from "../../components/ui/Modal";
import ImageUpload from "../../components/ui/ImageUpload";
import RichTextEditor from "../../components/ui/RichTextEditor";

const ManageExperience = () => {
  const { data, isLoading } = useExperience();
  const experiences = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      isCurrent: false,
      order: 0,
    },
  });

  const isCurrent = watch("isCurrent");
  const descriptionContent = watch("description");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["experience"] });
  };

  const createMutation = useMutation({
    mutationFn: experienceAPI.create,
    onSuccess: () => {
      toast.success("Experience added successfully!");
      invalidate();
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to add experience"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => experienceAPI.update(id, data),
    onSuccess: () => {
      toast.success("Experience updated successfully!");
      invalidate();
      setEditing(null);
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to update experience"),
  });

  const deleteMutation = useMutation({
    mutationFn: experienceAPI.delete,
    onSuccess: () => {
      toast.success("Experience deleted!");
      invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete experience"),
  });

  const startEdit = (item) => {
    setEditing(item);
    setShowForm(true);

    setValue("company", item.company);
    setValue("role", item.role);
    setValue("location", item.location);
    setValue("startDate", item.startDate?.slice(0, 10));
    setValue("endDate", item.endDate?.slice(0, 10));
    setValue("isCurrent", item.isCurrent);
    setValue("description", item.description);
    setValue("technologies", item.technologies?.join(", "));
    setValue("order", item.order);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    reset({
      isCurrent: false,
      order: 0,
    });
  };

  const onSubmit = (formDataValues) => {
    const formData = new FormData();

    Object.entries(formDataValues).forEach(([key, value]) => {
      if (key === "companyLogo" && value && value[0] instanceof File) {
        formData.append("companyLogo", value[0]);
      } else if (key === "technologies") {
        formData.append(
          "technologies",
          JSON.stringify(
            value
              ?.split(",")
              .map((tech) => tech.trim())
              .filter(Boolean) || []
          )
        );
      } else {
        formData.append(key, value ?? "");
      }
    });

    if (editing) {
      updateMutation.mutate({ id: editing._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Briefcase className="text-primary" size={28} />
            Manage Experience
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            Add and manage your work experience timeline
          </p>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className={`btn gap-2 shadow-md transition-all ${
            showForm ? "btn-error" : "btn-primary"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Experience"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editing ? "Edit Experience" : "Add Experience"}
              </h3>
              <p className="text-sm text-base-content/60">
                Fill all important professional details
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Company *</span>
                </label>
                <input
                  {...register("company", { required: true })}
                  className="input input-bordered rounded-xl"
                  placeholder="e.g., Google"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Role *</span>
                </label>
                <input
                  {...register("role", { required: true })}
                  className="input input-bordered rounded-xl"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Location</span>
                </label>
                <input
                  {...register("location")}
                  className="input input-bordered rounded-xl"
                  placeholder="Mumbai, India (or Remote)"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Technologies (comma separated)
                  </span>
                </label>
                <input
                  {...register("technologies")}
                  className="input input-bordered rounded-xl"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Start Date</span>
                </label>
                <input
                  type="date"
                  {...register("startDate")}
                  className="input input-bordered rounded-xl"
                />
              </div>
              {!isCurrent && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">End Date</span>
                  </label>
                  <input
                    type="date"
                    {...register("endDate")}
                    className="input input-bordered rounded-xl"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register("isCurrent")}
                className="toggle toggle-primary"
              />
              <span className="text-sm font-medium">
                Currently working here
              </span>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <RichTextEditor
                value={descriptionContent}
                onChange={(content) => setValue("description", content)}
                placeholder="Describe your role, achievements, and responsibilities..."
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Company Logo</span>
              </label>
              <ImageUpload
                name="companyLogo"
                register={register}
                currentImage={editing?.companyLogo?.url}
              />
            </div>

            <div className="form-control max-w-45">
              <label className="label">
                <span className="label-text font-medium">Display Order</span>
              </label>
              <input
                type="number"
                {...register("order")}
                className="input input-bordered rounded-xl"
                defaultValue={0}
                placeholder="0 (lowest first)"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="btn btn-primary rounded-xl gap-2 px-8"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
                <Check size={16} />
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
      ) : experiences.length === 0 ? (
        <div className="card bg-base-100/60 backdrop-blur-sm public-card rounded-3xl p-16 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Building2 size={42} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No experience entries yet</h3>
          <p className="text-base-content/60 max-w-md mx-auto">
            Add your professional experience to showcase your career journey.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((item) => (
            <div
              key={item._id}
              className="card bg-base-100/70 backdrop-blur-sm public-card rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6 flex flex-col lg:flex-row gap-6">
                {/* Logo */}
                <div className="shrink-0">
                  {item.companyLogo?.url ? (
                    <img
                      src={item.companyLogo.url}
                      alt={item.company}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-base-300 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Building2 size={32} className="text-primary/60" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-xl md:text-2xl font-bold">
                      {item.role}
                    </h3>
                    {item.isCurrent && (
                      <span className="badge badge-success badge-sm">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-semibold mb-2">
                    {item.company}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-base-content/60 mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      <span>{item.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      <span>
                        {new Date(item.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                        {" — "}
                        {item.isCurrent
                          ? "Present"
                          : item.endDate
                          ? new Date(item.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Present"}
                      </span>
                    </div>
                  </div>

                  {/* Tech stack */}
                  {item.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-base-200/70 text-xs font-medium public-card"
                        >
                          <Code2 size={12} />
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description preview */}
                  {item.description && (
                    <div
                      className="prose prose-sm max-w-none text-base-content/70 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
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
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="Delete Experience"
        message="Are you sure you want to delete this experience entry? This action cannot be undone."
      />
    </div>
  );
};

export default ManageExperience;
