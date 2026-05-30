import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Upload,
  Save,
  User,
  Briefcase,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Link as LinkIcon,
  Sparkles,
  Info,
  CheckCircle,
} from "lucide-react";

import { profileAPI } from "../../api";
import { useProfile } from "../../hooks/usePortfolioData";

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  website: LinkIcon,
};

const ManageProfile = () => {
  const { data: profile, isLoading } = useProfile();
  const queryClient = useQueryClient();

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();

  const fullName = watch("fullName");
  const tagline = watch("tagline");

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || "",
        tagline: profile.tagline || "",
        subTagline: profile.subTagline || "",
        ctaButtonText: profile.ctaButtonText || "",
        ctaButtonLink: profile.ctaButtonLink || "",
        availabilityText: profile.availabilityText || "",
        isAvailableForWork: profile.isAvailableForWork || false,
        "socialLinks.github": profile.socialLinks?.github || "",
        "socialLinks.linkedin": profile.socialLinks?.linkedin || "",
        "socialLinks.twitter": profile.socialLinks?.twitter || "",
        "socialLinks.instagram": profile.socialLinks?.instagram || "",
        "socialLinks.youtube": profile.socialLinks?.youtube || "",
        "socialLinks.website": profile.socialLinks?.website || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => {
        if (key.startsWith("socialLinks.")) {
          const platform = key.split(".")[1];
          formData.append(`socialLinks[${platform}]`, val || "");
        } else {
          formData.append(key, val ?? "");
        }
      });
      if (avatarFile) formData.append("avatar", avatarFile);
      await profileAPI.update(formData);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <User className="text-primary" size={28} />
            Manage Profile
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            Customize your portfolio profile information
          </p>
        </div>
        <div className="badge badge-primary badge-lg gap-2 px-4 py-3 shadow-md">
          <Sparkles size={14} />
          Portfolio Admin
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        {/* LEFT COLUMN – AVATAR & TIPS */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 shadow-md">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/70 shadow-xl">
                  {avatarPreview || profile?.avatar?.url ? (
                    <img
                      src={avatarPreview || profile?.avatar?.url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <User size={60} className="text-primary/60" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-2 right-2 btn btn-primary btn-circle btn-sm cursor-pointer shadow-lg transition-all hover:scale-105">
                  <Upload size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-bold">
                  {fullName || "Your Name"}
                </h3>
                <p className="text-primary mt-1 font-medium">
                  {tagline || "Professional Tagline"}
                </p>
              </div>

              <div className="mt-5">
                {profile?.isAvailableForWork ? (
                  <div className="badge badge-success gap-2 px-4 py-3 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    Available for Work
                  </div>
                ) : (
                  <div className="badge badge-error gap-2 px-4 py-3 shadow-sm">
                    Not Available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Tips Card */}
          <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 shadow-md">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Info size={18} className="text-primary" />
              Profile Tips
            </h3>
            <div className="space-y-3 text-sm text-base-content/70">
              <div className="flex gap-3 items-start">
                <span className="text-primary">✨</span>
                <p>Use a professional, high‑resolution profile image</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-primary">🚀</span>
                <p>Keep your tagline short, impactful, and role‑focused</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-primary">🌐</span>
                <p>Add active social profiles to build trust</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-primary">💼</span>
                <p>Mention availability for freelance or full‑time roles</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-primary">📌</span>
                <p>
                  CTA button should point to a contact page or a booking link
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN – FORMS */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle size={20} className="text-primary" />
                Basic Information
              </h3>
              <p className="text-sm text-base-content/60 mt-1">
                Main profile details displayed on your portfolio hero section
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  {...register("fullName")}
                  className="input input-bordered rounded-xl bg-base-100/50"
                  placeholder="Ajay Kandhare"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Tagline</span>
                </label>
                <input
                  {...register("tagline")}
                  className="input input-bordered rounded-xl bg-base-100/50"
                  placeholder="Full Stack Developer"
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Sub‑Tagline</span>
                </label>
                <input
                  {...register("subTagline")}
                  className="input input-bordered rounded-xl bg-base-100/50"
                  placeholder="Building scalable and modern web applications"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    CTA Button Text
                  </span>
                </label>
                <input
                  {...register("ctaButtonText")}
                  className="input input-bordered rounded-xl bg-base-100/50"
                  placeholder="Hire Me"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    CTA Button Link
                  </span>
                </label>
                <input
                  {...register("ctaButtonLink")}
                  className="input input-bordered rounded-xl bg-base-100/50"
                  placeholder="/contact"
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">
                    Availability Text
                  </span>
                </label>
                <input
                  {...register("availabilityText")}
                  className="input input-bordered rounded-xl bg-base-100/50"
                  placeholder="Available for freelance projects"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isAvailableForWork")}
                    className="toggle toggle-primary"
                  />
                  <span className="font-medium">Available for work</span>
                </label>
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Globe size={20} className="text-primary" />
                Social Links
              </h3>
              <p className="text-sm text-base-content/60 mt-1">
                Add your professional social profiles – leave empty to hide the
                icon
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.entries(SOCIAL_ICONS).map(([platform, Icon]) => (
                <div key={platform} className="form-control">
                  <label className="label">
                    <span className="label-text capitalize font-medium flex items-center gap-2">
                      <Icon size={16} />
                      {platform}
                    </span>
                  </label>
                  <input
                    {...register(`socialLinks.${platform}`)}
                    className="input input-bordered rounded-xl bg-base-100/50"
                    placeholder={`https://${platform}.com/yourusername`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full h-14 text-base gap-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            {saving ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <Save size={20} />
            )}
            {saving ? "Saving Profile..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageProfile;
