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
  Star,
  StarOff,
  ExternalLink,
  Github,
  FolderOpen,
  Sparkles,
  Globe,
  Link2,
  Tag,
  Code2,
} from "lucide-react";

import { projectsAPI } from "../../api";
import { useProjects } from "../../hooks/usePortfolioData";
import { ConfirmModal } from "../../components/ui/Modal";
import ImageUpload from "../../components/ui/ImageUpload";
import RichTextEditor from "../../components/ui/RichTextEditor";

const ManageProjects = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useProjects();
  const projects = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      status: "completed",
      featured: false,
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["projects"] });

  const createMut = useMutation({
    mutationFn: projectsAPI.create,
    onSuccess: () => {
      toast.success("Project created successfully");
      invalidate();
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to create project"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => projectsAPI.update(id, data),
    onSuccess: () => {
      toast.success("Project updated");
      invalidate();
      setEditing(null);
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to update project"),
  });

  const deleteMut = useMutation({
    mutationFn: projectsAPI.delete,
    onSuccess: () => {
      toast.success("Project deleted");
      invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("Delete failed"),
  });

  const startEdit = (item) => {
    setEditing(item);
    setShowForm(true);
    setValue("title", item.title || "");
    setValue("slug", item.slug || "");
    setValue("description", item.description || "");
    setValue("longDescription", item.longDescription || "");
    setValue("technologies", item.technologies?.join(", ") || "");
    setValue("category", item.category || "");
    setValue("liveUrl", item.liveUrl || "");
    setValue("githubUrl", item.githubUrl || "");
    setValue("caseStudyUrl", item.caseStudyUrl || "");
    setValue("featured", item.featured || false);
    setValue("status", item.status || "completed");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    reset({ status: "completed", featured: false });
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === "coverImage" && v?.[0] instanceof File) {
        formData.append(k, v[0]);
      } else if (k === "images" && v?.length > 0) {
        Array.from(v).forEach((file) => formData.append("images", file));
      } else if (k === "technologies") {
        formData.append(
          k,
          JSON.stringify(
            v
              ?.split(",")
              .map((tech) => tech.trim())
              .filter(Boolean) || []
          )
        );
      } else if (k === "featured") {
        formData.append(k, v ? "true" : "false");
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

  const longDescriptionContent = watch("longDescription");

  // Helper to toggle featured status directly from card
  const toggleFeatured = (project) => {
    const formData = new FormData();
    formData.append("featured", (!project.featured).toString());
    updateMut.mutate({ id: project._id, data: formData });
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-primary" size={28} />
            Manage Projects
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            Create, edit and organize your portfolio projects.
          </p>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className={`btn gap-2 shadow-md transition-all ${
            showForm ? "btn-error" : "btn-primary"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Project"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <FolderOpen size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editing ? "Edit Project" : "Add Project"}
              </h3>
              <p className="text-sm text-base-content/60">
                Fill all project details below
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Project Title *
                  </span>
                </label>
                <input
                  {...register("title", { required: true })}
                  className="input input-bordered rounded-xl"
                  placeholder="e.g., Awesome Portfolio"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Slug</span>
                </label>
                <input
                  {...register("slug")}
                  className="input input-bordered rounded-xl"
                  placeholder="awesome-portfolio"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Short Description
                </span>
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="textarea textarea-bordered rounded-xl"
                placeholder="Brief summary of the project..."
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Long Description</span>
              </label>
              <RichTextEditor
                value={longDescriptionContent}
                onChange={(content) => setValue("longDescription", content)}
                placeholder="Detailed explanation, features, challenges, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Cover Image</span>
                </label>
                <ImageUpload
                  name="coverImage"
                  register={register}
                  currentImage={editing?.coverImage?.url}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Gallery Images</span>
                </label>
                <input
                  type="file"
                  {...register("images")}
                  multiple
                  className="file-input file-input-bordered rounded-xl w-full"
                />
                <p className="text-xs text-base-content/50 mt-1">
                  You can select multiple images (optional)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Technologies (comma separated)
                  </span>
                </label>
                <input
                  {...register("technologies")}
                  className="input input-bordered rounded-xl"
                  placeholder="React, Node.js, Tailwind"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Category</span>
                </label>
                <input
                  {...register("category")}
                  className="input input-bordered rounded-xl"
                  placeholder="Web Development, Mobile App, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Live URL</span>
                </label>
                <input
                  {...register("liveUrl")}
                  className="input input-bordered rounded-xl"
                  placeholder="https://..."
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">GitHub URL</span>
                </label>
                <input
                  {...register("githubUrl")}
                  className="input input-bordered rounded-xl"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Case Study URL</span>
                </label>
                <input
                  {...register("caseStudyUrl")}
                  className="input input-bordered rounded-xl"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="font-medium">Featured Project</span>
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="toggle toggle-primary"
                />
              </label>
              <div className="form-control w-48">
                <select
                  {...register("status")}
                  className="select select-bordered rounded-xl"
                >
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
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
      ) : projects.length === 0 ? (
        <div className="card bg-base-100/60 backdrop-blur-sm public-card rounded-3xl p-16 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FolderOpen size={42} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No projects yet</h3>
          <p className="text-base-content/60 max-w-md mx-auto">
            Start by creating your first project to showcase your work.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="card bg-base-100/70 backdrop-blur-sm public-card rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                {project.coverImage?.url ? (
                  <img
                    src={project.coverImage.url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl">
                    🚀
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-4 left-4 badge badge-warning gap-1 py-3 px-3 shadow-md">
                    <Star size={12} fill="currentColor" />
                    Featured
                  </div>
                )}
                <div className="absolute bottom-4 right-4">
                  <span
                    className={`badge ${
                      project.status === "completed"
                        ? "badge-success"
                        : project.status === "in-progress"
                        ? "badge-warning"
                        : "badge-ghost"
                    } shadow-sm`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold line-clamp-1">
                      {project.title}
                    </h3>
                    {project.category && (
                      <p className="text-primary text-sm font-medium mt-1 flex items-center gap-1">
                        <Tag size={12} />
                        {project.category}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-base-content/70 mt-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-base-200/70 text-xs font-medium border border-base-300"
                      >
                        <Code2 size={10} />
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-xs text-base-content/50">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                {(project.liveUrl || project.githubUrl) && (
                  <div className="flex items-center gap-2 mt-5">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-xs btn-outline rounded-lg gap-1"
                      >
                        <Globe size={12} />
                        Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-xs btn-outline rounded-lg gap-1"
                      >
                        <Github size={12} />
                        Code
                      </a>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-base-200">
                  <button
                    onClick={() => startEdit(project)}
                    className="btn btn-sm btn-ghost rounded-lg gap-1"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(project._id)}
                    className="btn btn-sm btn-ghost text-error rounded-lg gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                  <button
                    onClick={() => toggleFeatured(project)}
                    className="btn btn-sm btn-ghost rounded-lg"
                    title={
                      project.featured
                        ? "Remove from featured"
                        : "Mark as featured"
                    }
                  >
                    {project.featured ? (
                      <Star
                        size={14}
                        className="text-warning"
                        fill="currentColor"
                      />
                    ) : (
                      <StarOff size={14} />
                    )}
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
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
};

export default ManageProjects;
