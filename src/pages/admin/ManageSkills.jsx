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
  Layers3,
  Sparkles,
  Code2,
  Database,
  Server,
  Wrench,
  Globe,
  Smartphone,
  Hash,
} from "lucide-react";

import { skillsAPI } from "../../api";
import { useSkills } from "../../hooks/usePortfolioData";
import { ConfirmModal } from "../../components/ui/Modal";

const CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Tools",
  "Languages",
  "Database",
  "Mobile",
  "Other",
];

const categoryConfig = {
  Frontend: { icon: Code2, gradient: "from-cyan-500 to-blue-500" },
  Backend: { icon: Server, gradient: "from-emerald-500 to-green-500" },
  DevOps: { icon: Wrench, gradient: "from-orange-500 to-amber-500" },
  Tools: { icon: Hash, gradient: "from-violet-500 to-purple-500" },
  Languages: { icon: Globe, gradient: "from-pink-500 to-rose-500" },
  Database: { icon: Database, gradient: "from-indigo-500 to-blue-600" },
  Mobile: { icon: Smartphone, gradient: "from-teal-500 to-cyan-500" },
  Other: { icon: Layers3, gradient: "from-slate-500 to-gray-500" },
};

const ManageSkills = () => {
  const { data, isLoading } = useSkills();
  const skills = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
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
      name: "",
      icon: "",
      percentage: 80,
      category: "Frontend",
      order: 0,
    },
  });

  const percentage = watch("percentage");
  const iconPreview = watch("icon");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["skills"] });
  };

  const createMutation = useMutation({
    mutationFn: skillsAPI.create,
    onSuccess: () => {
      toast.success("Skill added successfully!");
      invalidate();
      cancelForm();
    },
    onError: () => toast.error("Failed to add skill"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => skillsAPI.update(id, data),
    onSuccess: () => {
      toast.success("Skill updated successfully!");
      invalidate();
      cancelForm();
    },
    onError: () => toast.error("Failed to update skill"),
  });

  const deleteMutation = useMutation({
    mutationFn: skillsAPI.delete,
    onSuccess: () => {
      toast.success("Skill deleted!");
      invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete skill"),
  });

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      percentage: Number(formData.percentage || 0),
      order: Number(formData.order || 0),
    };
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const startEdit = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
    setValue("name", skill.name);
    setValue("icon", skill.icon || "");
    setValue("percentage", skill.percentage);
    setValue("category", skill.category);
    setValue("order", skill.order);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingSkill(null);
    reset({
      name: "",
      icon: "",
      percentage: 80,
      category: "Frontend",
      order: 0,
    });
  };

  const grouped = CATEGORIES.reduce((acc, category) => {
    const filteredSkills = skills.filter(
      (skill) => skill.category === category
    );
    if (filteredSkills.length > 0) {
      acc[category] = filteredSkills.sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
    }
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-2 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            <Sparkles className="text-primary" size={28} />
            Manage Skills
          </h2>
          <p className="text-base-content/60 mt-1">
            Organize and showcase your technical expertise
          </p>
        </div>
        <button
          onClick={() => (showForm ? cancelForm() : setShowForm(true))}
          className={`btn gap-2 shadow-lg transition-all ${
            showForm ? "btn-error" : "btn-primary"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Skill"}
        </button>
      </div>

      {/* Add/Edit Form (no animations) */}
      {showForm && (
        <div className="card bg-base-100/80 backdrop-blur-sm public-card shadow-xl rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ background: "var(--color-primary)" }}
            >
              {editingSkill ? <Pencil size={22} /> : <Plus size={22} />}
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <p className="text-sm text-base-content/60">
                Fill all required details below
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Skill Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Skill Name *</span>
              </label>
              <input
                {...register("name", { required: "Skill name is required" })}
                className="input input-bordered h-12 rounded-2xl"
                placeholder="e.g., React.js"
              />
              {errors.name && (
                <span className="text-error text-xs mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Icon / Emoji */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Icon / Emoji</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  {...register("icon")}
                  className="input input-bordered h-12 rounded-2xl flex-1"
                  placeholder="⚛️ or 📦"
                />
                {iconPreview && (
                  <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-2xl shadow-inner">
                    {iconPreview}
                  </div>
                )}
              </div>
            </div>

            {/* Percentage Slider */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">
                  Proficiency Level: {percentage}%
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                {...register("percentage")}
                className="range range-primary"
              />
              <div className="w-full flex justify-between text-xs text-base-content/50 px-2 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Category */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Category</span>
              </label>
              <select
                {...register("category")}
                className="select select-bordered h-12 rounded-2xl"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Order */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Display Order (lower = first)
                </span>
              </label>
              <input
                type="number"
                {...register("order")}
                className="input input-bordered h-12 rounded-2xl"
                placeholder="0"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="btn btn-primary flex-1 gap-2 h-12 rounded-2xl shadow-lg"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Check size={18} />
                )}
                {editingSkill ? "Update Skill" : "Add Skill"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="btn btn-ghost h-12 rounded-2xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : skills.length === 0 ? (
        <div className="card bg-base-100/60 backdrop-blur-sm public-card rounded-3xl p-16 text-center">
          <Layers3 size={60} className="mx-auto mb-4 text-base-content/20" />
          <h3 className="text-xl font-bold mb-2">No skills added yet</h3>
          <p className="text-base-content/60 mb-6">
            Start building your skill showcase
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary gap-2 shadow-lg"
          >
            <Plus size={18} />
            Add First Skill
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, categorySkills]) => {
            const config = categoryConfig[category] || categoryConfig.Other;
            const Icon = config.icon;
            return (
              <div
                key={category}
                className="card bg-base-100/50 backdrop-blur-sm public-card rounded-3xl overflow-hidden shadow-md"
              >
                {/* Category Header */}
                <div
                  className={`bg-linear-to-r ${config.gradient} p-5 text-white relative overflow-hidden`}
                >
                  <div className="absolute right-0 top-0 opacity-10 text-8xl -translate-y-4 translate-x-4">
                    <Icon size={120} strokeWidth={0.5} />
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{category}</h3>
                        <p className="text-white/80 text-sm">
                          {categorySkills.length} skill
                          {categorySkills.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="badge badge-ghost bg-white/20 border-none text-white">
                      {categorySkills.length}
                    </div>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="bg-base-200/50 public-card rounded-2xl p-4 transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className="w-12 h-12 rounded-xl bg-base-300 flex items-center justify-center text-2xl shadow-inner">
                            {skill.icon || "✨"}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold truncate pr-2">
                                {skill.name}
                              </h4>
                              <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {skill.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${skill.percentage}%`,
                                  background: "var(--color-primary)",
                                }}
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(skill)}
                              className="btn btn-xs btn-circle btn-ghost text-base-content/60 hover:text-primary transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteId(skill._id)}
                              className="btn btn-xs btn-circle btn-ghost text-base-content/60 hover:text-error transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
      />
    </div>
  );
};

export default ManageSkills;
