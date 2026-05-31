import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTheme } from "../../hooks/useTheme";

import {
  Save,
  Plus,
  Trash2,
  Settings,
  Palette,
  Globe,
  Search,
  Link2,
  Sparkles,
  ShieldAlert,
  Menu,
  X,
} from "lucide-react";

import { settingsAPI } from "../../api";
import { useSettings } from "../../hooks/usePortfolioData";

const blackThemeColors = [
  "#C6FF34", // Lime
  "#73FF00",
  "#84CC16",
  "#22C55E",
  "#FFFFFF",
];

const lightThemeColors = [
  "#21AEC0",
  "#21AECC",
  "#3B82F6",
  "#0EA5E9",
  "#06B6D4",
  "#2563EB",
];

const fontOptions = [
  { value: "inter", label: "Inter" },
  { value: "system", label: "System UI" },
  { value: "poppins", label: "Poppins" },
  { value: "manrope", label: "Manrope" },
  { value: "serif", label: "Editorial Serif" },
];

const ManageSettings = () => {
  const { data: settings, isLoading } = useSettings();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [navLinks, setNavLinks] = useState([]);

  // useForm MUST be called first before using watch()
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const { setTheme } = useTheme(settings?.defaultTheme || "black");

  // Now watch() is available to use
  const selectedTheme = watch("defaultTheme");
  const themeColor = watch("themeColor");

  // presetColors now reactively updates when selectedTheme changes
  const presetColors =
    selectedTheme === "black" ? blackThemeColors : lightThemeColors;

  useEffect(() => {
    if (settings) {
      reset({
        siteTitle: settings.siteTitle || "",
        siteDescription: settings.siteDescription || "",
        themeColor: settings.themeColor || "#6366f1",
        footerText: settings.footerText || "",
        googleAnalyticsId: settings.googleAnalyticsId || "",
        maintenanceMode: settings.maintenanceMode || false,
        fontFamily: settings.fontFamily || "inter",
        defaultTheme: settings.defaultTheme || "black",
        seoMeta: {
          title: settings.seoMeta?.title || "",
          description: settings.seoMeta?.description || "",
          keywords: settings.seoMeta?.keywords || "",
        },
      });
      setNavLinks(settings.navLinks || []);
    }
  }, [settings, reset]);

  // useEffect(() => {
  //   if (themeColor) {
  //     document.documentElement.style.setProperty("--color-primary", themeColor);
  //   }
  // }, [themeColor]);

  // useEffect(() => {
  //   if (!themeColor) return;
  //   document.documentElement.style.setProperty("--color-primary", themeColor);
  //   window.dispatchEvent(
  //     new CustomEvent("portfolio-preview-change", {
  //       detail: { color: themeColor },
  //     })
  //   );
  // }, [themeColor]);

  // useEffect(() => {
  //   if (!selectedTheme) return;
  //   window.dispatchEvent(
  //     new CustomEvent("portfolio-preview-change", {
  //       detail: { theme: selectedTheme },
  //     })
  //   );
  // }, [selectedTheme]);

  useEffect(() => {
    if (!themeColor) return;
    document.documentElement.style.setProperty("--color-primary", themeColor);
    window.dispatchEvent(
      new CustomEvent("portfolio-preview-change", {
        detail: { color: themeColor },
      })
    );
  }, [themeColor]);

  useEffect(() => {
    if (!selectedTheme) return;
    const firstColor =
      selectedTheme === "black" ? blackThemeColors[0] : lightThemeColors[0];
    setTheme(selectedTheme);
    setValue("themeColor", firstColor);
  }, [selectedTheme]);

  const onSubmit = async (data) => {
    const hexRegex = /^#([A-Fa-f0-9]{6})$/;

    if (!hexRegex.test(data.themeColor)) {
      toast.error("Please enter a valid HEX color");
      setSaving(false);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...data,
        navLinks,
        seoMeta: {
          title: data.seoMeta?.title || "",
          description: data.seoMeta?.description || "",
          keywords: data.seoMeta?.keywords || "",
        },
      };

      await settingsAPI.update(payload);
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const addNavLink = () => {
    setNavLinks([...navLinks, { label: "", href: "", order: navLinks.length }]);
  };

  const removeNavLink = (i) => {
    setNavLinks(navLinks.filter((_, idx) => idx !== i));
  };

  const updateNavLink = (i, field, value) => {
    const updated = [...navLinks];
    updated[i] = { ...updated[i], [field]: value };
    setNavLinks(updated);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
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
            <Settings className="text-primary" size={28} />
            Site Settings
          </h2>
          <p className="text-base-content/60 mt-1 text-sm">
            Customize your portfolio appearance and behavior
          </p>
        </div>
        <div className="badge badge-primary badge-lg gap-2 px-4 py-3 shadow-md">
          <Sparkles size={14} />
          Admin Panel
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* GENERAL SETTINGS */}
        <div className="card admin-surface rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">General Settings</h3>
              <p className="text-sm text-base-content/60">
                Main website information
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Site Title</span>
                </label>
                <input
                  {...register("siteTitle")}
                  className="input input-bordered rounded-xl"
                  placeholder="My Portfolio"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Default Theme</span>
                </label>
                <select
                  {...register("defaultTheme")}
                  className="select select-bordered rounded-xl"
                >
                  <option value="black">Black</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Site Description</span>
              </label>
              <textarea
                {...register("siteDescription")}
                rows={3}
                className="textarea textarea-bordered rounded-xl"
                placeholder="Describe your portfolio..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Footer Text</span>
                </label>
                <input
                  {...register("footerText")}
                  className="input input-bordered rounded-xl"
                  placeholder="© 2026 Your Name"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Google Analytics ID
                  </span>
                </label>
                <input
                  {...register("googleAnalyticsId")}
                  className="input input-bordered rounded-xl"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>

            <label className="flex items-center justify-between rounded-xl border border-warning/20 bg-warning/5 p-4 cursor-pointer transition-colors hover:bg-warning/10">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-warning" size={22} />
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-base-content/60">
                    Temporarily disable public access
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                {...register("maintenanceMode")}
                className="toggle toggle-warning"
              />
            </label>
          </div>
        </div>

        {/* THEME CUSTOMIZATION */}
        <div className="card admin-surface rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Theme Customization</h3>
              <p className="text-sm text-base-content/60">
                Change your brand accent color
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="color"
              value={themeColor || "#C6FF34"}
              onChange={(e) => setValue("themeColor", e.target.value)}
              className="h-16 w-16 cursor-pointer rounded-2xl border-2 border-base-300 bg-transparent shadow-sm"
            />

            <div className="flex-1">
              <label className="label">
                <span className="label-text font-medium">Hex Color</span>
              </label>

              <input
                type="text"
                value={themeColor || ""}
                onChange={(e) => {
                  let value = e.target.value.toUpperCase();
                  if (!value.startsWith("#")) {
                    value = "#" + value;
                  }
                  setValue("themeColor", value);
                }}
                placeholder="#C6FF34"
                className="input input-bordered rounded-xl font-mono w-full"
              />

              <p className="text-sm text-base-content/60 mt-2">
                Current Color: <span className="font-bold">{themeColor}</span>
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-base-content/60 mb-3">
              Preset colors for{" "}
              <span className="font-semibold capitalize">{selectedTheme}</span>{" "}
              theme
            </p>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  // onClick={() => {
                  //   setValue("themeColor", color);
                  //   document.documentElement.style.setProperty(
                  //     "--color-primary",
                  //     color
                  //   );
                  // }}
                  onClick={() => setValue("themeColor", color)}
                  className={`h-10 w-10 rounded-xl border-4 transition-all hover:scale-105 ${
                    themeColor === color
                      ? "border-white shadow-lg scale-110 ring-2 ring-primary/50"
                      : "border-base-300 hover:border-base-200"
                  }`}
                  style={{ background: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Portfolio Font</span>
              </label>
              <select
                {...register("fontFamily")}
                className="select select-bordered rounded-xl"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="card admin-surface rounded-2xl p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Link2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Navigation Links</h3>
                <p className="text-sm text-base-content/60">
                  Customize navbar menu items
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={addNavLink}
              className="btn btn-primary btn-sm gap-2 rounded-xl"
            >
              <Plus size={16} />
              Add Link
            </button>
          </div>

          {navLinks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-base-300 rounded-2xl">
              <Menu size={40} className="mx-auto text-base-content/30 mb-3" />
              <p className="text-base-content/50">No navigation links added</p>
              <button
                type="button"
                onClick={addNavLink}
                className="btn btn-ghost btn-sm mt-3 gap-1"
              >
                <Plus size={14} />
                Add your first link
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {navLinks.map((link, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-base-200/50 public-card"
                >
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-base-content/60 mb-1">
                      Label
                    </label>
                    <input
                      value={link.label}
                      onChange={(e) =>
                        updateNavLink(i, "label", e.target.value)
                      }
                      className="input input-bordered w-full rounded-xl"
                      placeholder="e.g., Home"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-base-content/60 mb-1">
                      Path
                    </label>
                    <input
                      value={link.href}
                      onChange={(e) => updateNavLink(i, "href", e.target.value)}
                      className="input input-bordered w-full rounded-xl"
                      placeholder="/projects"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeNavLink(i)}
                      className="btn btn-error btn-outline rounded-xl gap-1"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO META SETTINGS */}
        <div className="card admin-surface rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
              <Search size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">SEO Meta Settings</h3>
              <p className="text-sm text-base-content/60">
                Improve search engine visibility
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Meta Title</span>
              </label>
              <input
                {...register("seoMeta.title")}
                className="input input-bordered rounded-xl"
                placeholder="Portfolio | Web Developer"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Meta Description</span>
              </label>
              <textarea
                {...register("seoMeta.description")}
                rows={3}
                className="textarea textarea-bordered rounded-xl"
                placeholder="Describe your website for search engines..."
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Keywords</span>
              </label>
              <input
                {...register("seoMeta.keywords")}
                className="input input-bordered rounded-xl"
                placeholder="developer, portfolio, react, fullstack"
              />
              <p className="text-xs text-base-content/50 mt-1">
                Separate keywords with commas
              </p>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary w-full h-14 text-base font-semibold gap-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          {saving ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Save size={20} />
          )}
          {saving ? "Saving Settings..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
};

export default ManageSettings;
