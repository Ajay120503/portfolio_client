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
  FileText,
} from "lucide-react";

import { blogAPI } from "../../api";
import { useBlogs } from "../../hooks/usePortfolioData";
import { ConfirmModal } from "../../components/ui/Modal";
import ImageUpload from "../../components/ui/ImageUpload";
import RichTextEditor from "../../components/ui/RichTextEditor.jsx";

// Helper to strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const ManageBlog = () => {
  const { data, isLoading } = useBlogs();
  const blogPosts = Array.isArray(data)
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
      published: false,
      featured: false,
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["blogPosts"] });

  const createMut = useMutation({
    mutationFn: blogAPI.create,
    onSuccess: () => {
      toast.success("Blog post created");
      invalidate();
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to create post"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => blogAPI.update(id, data),
    onSuccess: () => {
      toast.success("Blog post updated");
      invalidate();
      setEditing(null);
      setShowForm(false);
      reset();
    },
    onError: () => toast.error("Failed to update post"),
  });

  const deleteMut = useMutation({
    mutationFn: blogAPI.delete,
    onSuccess: () => {
      toast.success("Blog post deleted");
      invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete post"),
  });

  // const startEdit = (item) => {
  //   setEditing(item);
  //   setShowForm(true);
  //   setValue("title", item.title || "");
  //   setValue("slug", item.slug || "");
  //   setValue("excerpt", item.excerpt || "");
  //   setValue("content", item.content || "");
  //   setValue("tags", item.tags?.join(", ") || "");
  //   setValue("category", item.category || "");
  //   setValue("published", item.published || false);
  //   setValue("featured", item.featured || false);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const startEdit = (item) => {
    setEditing(item);
    setShowForm(true);
    setValue("title", item.title || "");
    setValue("slug", item.slug || "");
    setValue("excerpt", item.excerpt || "");
    // Strip HTML when populating the editor
    setValue("content", stripHtml(item.content) || "");
    setValue("tags", item.tags?.join(", ") || "");
    setValue("category", item.category || "");
    setValue("published", item.published || false);
    setValue("featured", item.featured || false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    reset({ published: false, featured: false });
  };

  // const onSubmit = (data) => {
  //   const formData = new FormData();
  //   Object.entries(data).forEach(([k, v]) => {
  //     if (k === "coverImage" && v && v[0] instanceof File) {
  //       formData.append(k, v[0]);
  //     } else if (k === "tags") {
  //       formData.append(
  //         k,
  //         JSON.stringify(
  //           v
  //             ?.split(",")
  //             .map((tag) => tag.trim())
  //             .filter(Boolean) || []
  //         )
  //       );
  //     } else {
  //       formData.append(k, v ?? "");
  //     }
  //   });
  //   if (editing) {
  //     updateMut.mutate({ id: editing._id, data: formData });
  //   } else {
  //     createMut.mutate(formData);
  //   }
  // };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === "coverImage" && v && v[0] instanceof File) {
        formData.append(k, v[0]);
      } else if (k === "tags") {
        formData.append(
          k,
          JSON.stringify(
            v
              ?.split(",")
              .map((tag) => tag.trim())
              .filter(Boolean) || []
          )
        );
      } else if (k === "content") {
        // Strip HTML before saving
        const plainText = stripHtml(v);
        formData.append(k, plainText);
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

  const content = watch("content");

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-primary" size={28} />
            Manage Blog Posts
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            Create, edit and manage all your blog articles
          </p>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className={`btn gap-2 shadow-md transition-all ${
            showForm ? "btn-error" : "btn-primary"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "New Post"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editing ? "Edit Blog Post" : "Create Blog Post"}
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
                  placeholder="Blog post title"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Slug</span>
                </label>
                <input
                  {...register("slug")}
                  className="input input-bordered rounded-xl"
                  placeholder="auto-generated"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Excerpt</span>
              </label>
              <textarea
                {...register("excerpt")}
                rows={2}
                className="textarea textarea-bordered rounded-xl"
                placeholder="Short summary of the post..."
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Content</span>
              </label>
              <RichTextEditor
                value={content}
                onChange={(c) => setValue("content", c)}
                placeholder="Write your blog content here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Cover Image</span>
                </label>
                <ImageUpload
                  name="coverImage"
                  register={register}
                  currentImage={editing?.coverImage?.url}
                  helperText="Upload featured image"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Tags</span>
                </label>
                <input
                  {...register("tags")}
                  className="input input-bordered rounded-xl"
                  placeholder="React, Node.js, MongoDB"
                />
                <p className="text-xs text-base-content/50 mt-1">
                  Separate tags with commas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Category</span>
                </label>
                <input
                  {...register("category")}
                  className="input input-bordered rounded-xl"
                  placeholder="Web Development / Tutorial"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="font-medium">Published</span>
                <input
                  type="checkbox"
                  {...register("published")}
                  className="toggle toggle-primary"
                />
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="font-medium">Featured</span>
                <input
                  type="checkbox"
                  {...register("featured")}
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
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Check size={16} />
                )}
                {editing ? "Update" : "Publish"}
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
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : blogPosts.length === 0 ? (
        <div className="card bg-base-100/60 backdrop-blur-sm public-card rounded-3xl p-16 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FolderOpen size={42} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Blog Posts Yet</h3>
          <p className="text-base-content/60 max-w-md mx-auto">
            Start by creating your first blog article.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post._id}
              className="card bg-base-100/70 backdrop-blur-sm public-card rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Cover Image */}
              <div className="relative h-52 overflow-hidden">
                {post.coverImage?.url ? (
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl">
                    ✍️
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  {post.featured && (
                    <span className="badge badge-warning gap-1 shadow-md">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </span>
                  )}
                  <span
                    className={`badge ${
                      post.published ? "badge-success" : "badge-ghost"
                    } shadow-sm`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-base-content/60 mb-2">
                  <span className="flex items-center gap-1">
                    <FolderOpen size={12} />
                    {post.category || "General"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-outline badge-primary gap-1 px-2 py-2 text-xs"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 4 && (
                      <span className="badge badge-ghost text-xs">
                        +{post.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-base-200">
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(post)}
                      className="btn btn-xs btn-ghost gap-1 text-base-content/60 hover:text-primary transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(post._id)}
                      className="btn btn-xs btn-ghost gap-1 text-base-content/60 hover:text-error transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        updateMut.mutate({
                          id: post._id,
                          data: { published: !post.published },
                        })
                      }
                      className="btn btn-xs btn-circle btn-ghost"
                      title={post.published ? "Unpublish" : "Publish"}
                    >
                      {post.published ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        updateMut.mutate({
                          id: post._id,
                          data: { featured: !post.featured },
                        })
                      }
                      className="btn btn-xs btn-circle btn-ghost"
                      title={
                        post.featured ? "Remove featured" : "Mark featured"
                      }
                    >
                      {post.featured ? (
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
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
      />
    </div>
  );
};

export default ManageBlog;
