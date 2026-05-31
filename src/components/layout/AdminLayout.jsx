import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  ChevronRight,
  Code2,
  ExternalLink,
  FolderOpen,
  GraduationCap,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Star,
  User,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { useSettings, useProfile } from "../../hooks/usePortfolioData";

const sidebarGroups = [
  {
    label: "Overview",
    links: [
      {
        path: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      { path: "/admin/messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    label: "Portfolio",
    links: [
      { path: "/admin/profile", label: "Profile", icon: User },
      { path: "/admin/about", label: "About", icon: Info },
      { path: "/admin/skills", label: "Skills", icon: Zap },
      { path: "/admin/experience", label: "Experience", icon: Briefcase },
      { path: "/admin/education", label: "Education", icon: GraduationCap },
      { path: "/admin/projects", label: "Projects", icon: FolderOpen },
    ],
  },
  {
    label: "Content",
    links: [
      { path: "/admin/services", label: "Services", icon: Wrench },
      { path: "/admin/testimonials", label: "Testimonials", icon: Star },
      { path: "/admin/blog", label: "Blog", icon: BookOpen },
    ],
  },
  {
    label: "System",
    links: [{ path: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

const sidebarLinks = sidebarGroups.flatMap((group) => group.links);

const Sidebar = ({ collapsed, admin, location, onLinkClick, onLogout }) => {
  const { data: settings } = useSettings();
  const { theme } = useTheme(settings?.defaultTheme);
  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="flex h-full flex-col bg-base-100/80 backdrop-blur-sm">
      {/* Header area */}
      <div className="border-b border-base-200 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-white shadow-lg">
            <Code2
              size={20}
              className={theme === "black" ? "text-black" : "text-white"}
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="truncate text-sm font-black tracking-tight">
                Portfolio Admin
              </h2>
              <p className="truncate text-xs text-base-content/50">
                {admin?.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        {sidebarGroups.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                {group.label}
              </p>
            )}
            <div className="space-y-1.5">
              {group.links.map(({ path, label, icon: Icon, exact }) => {
                const active = isActive(path, exact);
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={onLinkClick}
                    title={collapsed ? label : undefined}
                    className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-base-content/70 hover:bg-base-200/70 hover:text-base-content"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all ${
                        active
                          ? "bg-primary/20 text-primary"
                          : "bg-base-200/50 text-base-content/60 group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{label}</span>
                        {active && (
                          <ChevronRight size={14} className="opacity-60" />
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="space-y-2 border-t border-base-200 p-4">
        <Link
          to="/"
          target="_blank"
          title={collapsed ? "View Portfolio" : undefined}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-base-content/70 transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <ExternalLink size={18} />
          {!collapsed && (
            <>
              <span className="flex-1">View Portfolio</span>
              <ChevronRight size={14} className="opacity-60" />
            </>
          )}
        </Link>
        <button
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-error transition-colors hover:bg-error/10"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: settings } = useSettings();
  const { theme } = useTheme(settings?.defaultTheme);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const currentLabel =
    sidebarLinks.find((link) =>
      link.exact
        ? location.pathname === link.path
        : location.pathname.startsWith(link.path)
    )?.label || "Admin";

  const handleMenuToggle = () => {
    if (window.innerWidth >= 768) {
      setSidebarOpen((prev) => !prev);
    } else {
      setMobileSidebarOpen((prev) => !prev);
    }
  };

  return (
    <div className="admin-shell flex h-screen overflow-hidden bg-base-100">
      {/* Desktop sidebar */}
      <aside
        className={`hidden shrink-0 flex-col overflow-hidden border-r border-base-200 bg-base-100/80 backdrop-blur-sm transition-all duration-300 md:flex ${
          sidebarOpen ? "w-70" : "w-20"
        }`}
      >
        <Sidebar
          collapsed={!sidebarOpen}
          admin={admin}
          location={location}
          onLinkClick={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-base-200 bg-base-100/95 shadow-2xl backdrop-blur-md md:hidden">
            <div className="flex items-center justify-between border-b border-base-200 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary text-white">
                  <Code2
                    size={20}
                    className={theme === "black" ? "text-black" : "text-white"}
                  />
                </div>
                <span className="font-bold tracking-tight">
                  Portfolio Admin
                </span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X size={18} />
              </button>
            </div>
            <Sidebar
              collapsed={false}
              admin={admin}
              location={location}
              onLinkClick={() => setMobileSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </>
      )}

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-base-200 bg-base-100/80 px-4 backdrop-blur-sm md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={handleMenuToggle}
              className="btn btn-ghost btn-circle"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <span className="md:hidden">
                <Menu size={20} />
              </span>
              <span className="hidden md:inline">
                {sidebarOpen ? (
                  <PanelLeftClose size={20} />
                ) : (
                  <PanelLeftOpen size={20} />
                )}
              </span>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-base-content/50">
                <span>Admin</span>
                <ChevronRight size={12} />
                <span className="truncate font-medium">{currentLabel}</span>
              </div>
              <h1 className="truncate text-lg font-black tracking-tight md:text-xl">
                {currentLabel}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="btn btn-ghost btn-sm hidden rounded-xl sm:inline-flex gap-2"
            >
              <ExternalLink size={16} />
              Preview
            </Link>
            <Link
              to="/admin/messages"
              className="btn btn-ghost btn-sm btn-circle relative"
              aria-label="Messages"
            >
              <Bell size={18} />
            </Link>
            <div className="hidden h-6 w-px bg-base-300 md:block" />
            <div className="hidden min-w-0 text-right md:block">
              <p className="text-xs font-semibold leading-tight">
                {admin?.name || "Admin"}
              </p>
              <p className="max-w-40 truncate text-xs text-base-content/50">
                {admin?.email}
              </p>
            </div>
            <div className="avatar placeholder">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md">
                <span className="text-sm font-bold">
                  {admin?.email?.[0]?.toUpperCase() || "A"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-main flex-1 overflow-y-auto bg-base-200/35 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
