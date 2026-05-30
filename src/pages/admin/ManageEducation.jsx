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
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  Building2,
} from "lucide-react";

import { educationAPI } from "../../api";
import { useEducation } from "../../hooks/usePortfolioData";
import { ConfirmModal } from "../../components/ui/Modal";
import ImageUpload from "../../components/ui/ImageUpload";

const ManageEducation = () => {
  const { data: educationData, isLoading } = useEducation();
  const education = Array.isArray(educationData)
    ? educationData
    : educationData?.data || [];

  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      isCurrent: false,
    },
  });

  const isCurrent = watch("isCurrent");

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["education"] });

  const createMut = useMutation({
    mutationFn: educationAPI.create,
    onSuccess: () => {
      toast.success("Education added successfully");
      invalidate();
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to add education"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => educationAPI.update(id, data),
    onSuccess: () => {
      toast.success("Education updated");
      invalidate();
      setEditing(null);
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to update education"),
  });

  const deleteMut = useMutation({
    mutationFn: educationAPI.delete,
    onSuccess: () => {
      toast.success("Education deleted");
      invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete education"),
  });

  const startEdit = (edu) => {
    setEditing(edu);
    setShowForm(true);
    setValue("institution", edu.institution);
    setValue("degree", edu.degree);
    setValue("field", edu.field);
    setValue("startYear", edu.startYear);
    setValue("endYear", edu.endYear);
    setValue("grade", edu.grade);
    setValue("description", edu.description);
    setValue("order", edu.order);
    setValue("isCurrent", edu.isCurrent || false);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    reset({ isCurrent: false });
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === "logo" && v && v[0] instanceof File) {
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

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <GraduationCap className="text-primary" size={28} />
            Manage Education
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            Manage your academic qualifications and studies
          </p>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className={`btn gap-2 shadow-md transition-all ${
            showForm ? "btn-error" : "btn-primary"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Education"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editing ? "Edit Education" : "Add Education"}
              </h3>
              <p className="text-sm text-base-content/60">
                Fill your academic information
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Institution *</span>
                </label>
                <input
                  {...register("institution", { required: true })}
                  className="input input-bordered rounded-xl"
                  placeholder="e.g., Stanford University"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Degree *</span>
                </label>
                <input
                  {...register("degree", { required: true })}
                  className="input input-bordered rounded-xl"
                  placeholder="e.g., Bachelor of Science"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Field of Study</span>
                </label>
                <input
                  {...register("field")}
                  className="input input-bordered rounded-xl"
                  placeholder="Computer Science"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Grade / CGPA</span>
                </label>
                <input
                  {...register("grade")}
                  className="input input-bordered rounded-xl"
                  placeholder="3.8 GPA / 85%"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Start Year</span>
                </label>
                <input
                  type="number"
                  {...register("startYear")}
                  className="input input-bordered rounded-xl"
                  placeholder="2020"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">End Year</span>
                </label>
                <input
                  type="number"
                  {...register("endYear")}
                  className="input input-bordered rounded-xl"
                  placeholder={isCurrent ? "Present" : "2024"}
                  disabled={isCurrent}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-center justify-between rounded-xl bg-base-200 p-4">
                <div>
                  <span className="block font-medium">Currently Studying</span>
                  <span className="text-sm text-base-content/60">
                    Mark this education as ongoing
                  </span>
                </div>
                <input
                  type="checkbox"
                  {...register("isCurrent")}
                  className="toggle toggle-primary"
                />
              </div>
              <ImageUpload
                name="logo"
                register={register}
                currentImage={editing?.logo?.url}
                label="Institution Logo"
                helperText="Upload school / university logo"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="textarea textarea-bordered rounded-xl"
                placeholder="Achievements, relevant coursework, activities..."
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
                disabled={createMut.isPending || updateMut.isPending}
                className="btn btn-primary rounded-xl gap-2 px-8"
              >
                {(createMut.isPending || updateMut.isPending) && (
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
      ) : education.length === 0 ? (
        <div className="card bg-base-100/60 backdrop-blur-sm public-card rounded-3xl p-16 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <GraduationCap size={42} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No education added yet</h3>
          <p className="text-base-content/60 max-w-md mx-auto">
            Add your educational qualifications to showcase your academic
            background.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {education.map((edu) => (
            <div
              key={edu._id}
              className="card bg-base-100/70 backdrop-blur-sm public-card rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex gap-5">
                  {/* Logo / Icon */}
                  <div className="shrink-0">
                    {edu.logo?.url ? (
                      <img
                        src={edu.logo.url}
                        alt={edu.institution}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-base-300 shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Building2 size={28} className="text-primary/60" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg md:text-xl font-bold truncate">
                        {edu.institution}
                      </h3>
                      {edu.isCurrent && (
                        <span className="badge badge-success badge-sm">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-semibold text-sm md:text-base">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs md:text-sm text-base-content/60">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {edu.startYear} —{" "}
                          {edu.isCurrent ? "Present" : edu.endYear || "Present"}
                        </span>
                      </div>
                      {edu.grade && (
                        <div className="flex items-center gap-1">
                          <Award size={14} />
                          <span>{edu.grade}</span>
                        </div>
                      )}
                    </div>
                    {edu.description && (
                      <p className="text-sm text-base-content/70 mt-3 leading-relaxed line-clamp-2">
                        {edu.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => startEdit(edu)}
                      className="btn btn-xs btn-circle btn-ghost text-base-content/60 hover:text-primary transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(edu._id)}
                      className="btn btn-xs btn-circle btn-ghost text-base-content/60 hover:text-error transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
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
        title="Delete Education"
        message="Are you sure you want to delete this education entry? This action cannot be undone."
      />
    </div>
  );
};

export default ManageEducation;
