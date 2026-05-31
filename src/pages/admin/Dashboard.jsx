import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  Eye,
  FolderOpen,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Zap,
  Users,
  Star,
} from "lucide-react";

import { useDashboardStats } from "../../hooks/usePortfolioData";

const StatCard = ({ icon: Icon, label, value, color, link }) => (
  <Link
    to={link}
    className="group relative overflow-hidden rounded-3xl public-card bg-base-100/80 backdrop-blur-sm p-6 shadow-md transition-all hover:shadow-lg hover:border-primary/40"
  >
    <div className="relative z-10">
      <div className="mb-5 flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ${color}`}
        >
          <Icon size={26} className="text-white" />
        </div>
        <ArrowUpRight
          size={18}
          className="text-base-content/30 transition-colors group-hover:text-primary"
        />
      </div>
      <h3 className="text-3xl font-black tracking-tight md:text-4xl">
        <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          {value ?? 0}
        </span>
      </h3>
      <p className="mt-1 text-sm font-medium text-base-content/60">{label}</p>
    </div>
  </Link>
);

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-sm text-base-content/50">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: FolderOpen,
      label: "Total Projects",
      value: stats?.totalProjects,
      color: "bg-gradient-to-br from-primary to-secondary",
      link: "/admin/projects",
    },
    {
      icon: BookOpen,
      label: "Blog Posts",
      value: stats?.totalBlogs,
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
      link: "/admin/blog",
    },
    {
      icon: MessageSquare,
      label: "Unread Messages",
      value: stats?.unreadMessages,
      color: "bg-gradient-to-br from-rose-500 to-orange-500",
      link: "/admin/messages",
    },
    {
      icon: Zap,
      label: "Skills",
      value: stats?.totalSkills,
      color: "bg-gradient-to-br from-violet-500 to-purple-500",
      link: "/admin/skills",
    },
  ];

 const quickActions = [
   {
     label: "Profile",
     path: "/admin/profile",
     icon: Users,
     desc: "Edit your info",
   },
   {
     label: "Projects",
     path: "/admin/projects",
     icon: FolderOpen,
     desc: "Add or edit projects",
   },
   {
     label: "Blog",
     path: "/admin/blog",
     icon: BookOpen,
     desc: "Write new article",
   },
   {
     label: "Settings",
     path: "/admin/settings",
     icon: Star,
     desc: "Site configuration",
   },
 ];

 return (
   <div className="space-y-8">
     {/* Header Card */}
     <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 md:p-8 shadow-md">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
         <div>
           <div className="flex items-center gap-2 mb-2">
             <Sparkles size={18} className="text-primary" />
             <span className="text-sm font-semibold uppercase tracking-wider text-primary">
               Portfolio Overview
             </span>
           </div>
           <h1 className="text-3xl md:text-4xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
             Dashboard
           </h1>
           <p className="mt-2 text-base-content/60">
             Welcome back. Here's the latest activity from your portfolio.
           </p>
         </div>
         <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-5 py-3 border border-primary/20">
           <TrendingUp size={18} className="text-primary" />
           <span className="text-sm font-semibold text-primary">
             Portfolio active
           </span>
         </div>
       </div>
     </div>

     {/* Stats Grid */}
     <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
       {statCards.map((card) => (
         <StatCard key={card.label} {...card} />
       ))}
     </div>

     {/* Recent Messages + Quick Actions */}
     <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
       {/* Recent Messages */}
       <div className="xl:col-span-2">
         <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 shadow-md h-full">
           <div className="mb-6 flex items-center justify-between gap-4">
             <div>
               <h3 className="flex items-center gap-2 text-xl font-bold">
                 <MessageSquare size={20} className="text-primary" />
                 Recent Messages
               </h3>
               <p className="mt-1 text-sm text-base-content/50">
                 Latest messages from your contact form
               </p>
             </div>
             <Link
               to="/admin/messages"
               className="btn btn-primary btn-sm rounded-xl gap-1"
             >
               View All
               <ArrowUpRight size={14} />
             </Link>
           </div>

           {stats?.recentMessages?.length > 0 ? (
             <div className="space-y-4">
               {stats.recentMessages.map((msg) => (
                 <div
                   key={msg._id}
                   className="group rounded-2xl public-card bg-base-100/50 p-4 transition-all hover:border-primary/30 hover:bg-base-100/80"
                 >
                   <div className="flex gap-4">
                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 font-bold text-primary shadow-sm">
                       {msg.name?.[0]?.toUpperCase() || "?"}
                     </div>
                     <div className="min-w-0 flex-1">
                       <div className="mb-1 flex flex-wrap items-center gap-2">
                         <h4 className="truncate font-semibold">{msg.name}</h4>
                         {!msg.isRead && (
                           <span className="badge badge-error badge-sm gap-1">
                             <Sparkles size={10} />
                             New
                           </span>
                         )}
                       </div>
                       <p className="truncate text-sm text-base-content/70">
                         {msg.subject}
                       </p>
                       <div className="mt-2 flex items-center gap-2 text-xs text-base-content/40">
                         <Clock size={12} />
                         {new Date(msg.createdAt).toLocaleDateString()}
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="py-16 text-center">
               <div className="mx-auto w-20 h-20 rounded-full bg-base-200 flex items-center justify-center text-4xl mb-4">
                 📭
               </div>
               <h4 className="text-lg font-semibold mb-1">No messages yet</h4>
               <p className="text-sm text-base-content/50">
                 New contact messages will appear here.
               </p>
             </div>
           )}
         </div>
       </div>

       {/* Quick Actions */}
       <div>
         <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 shadow-md h-full">
           <div className="mb-6">
             <h3 className="flex items-center gap-2 text-xl font-bold">
               <Eye size={20} className="text-primary" />
               Quick Actions
             </h3>
             <p className="mt-1 text-sm text-base-content/50">
               Manage your portfolio faster
             </p>
           </div>

           <div className="space-y-3">
             {quickActions.map((item) => (
               <Link
                 key={item.path}
                 to={item.path}
                 className="group flex items-center justify-between rounded-2xl public-card bg-base-100/50 p-4 transition-all hover:border-primary/40 hover:bg-primary/5"
               >
                 <div className="flex items-center gap-4">
                   <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-sm">
                     <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
                       <item.icon size={22} className="text-primary" />
                     </div>
                   </div>
                   <div>
                     <p className="font-semibold transition-colors group-hover:text-primary">
                       {item.label}
                     </p>
                     <p className="text-xs text-base-content/50">{item.desc}</p>
                   </div>
                 </div>
                 <ArrowUpRight
                   size={18}
                   className="text-base-content/30 transition-colors group-hover:text-primary"
                 />
               </Link>
             ))}
           </div>

           {/* Extra Stats */}
           <div className="mt-6 pt-4 border-t border-base-200">
             <div className="flex items-center justify-between text-sm">
               <span className="text-base-content/50">Total page views</span>
               <span className="font-bold text-primary">
                 {stats?.totalViews?.toLocaleString() || 0}
               </span>
             </div>
             <div className="flex items-center justify-between text-sm mt-2">
               <span className="text-base-content/50">Active projects</span>
               <span className="font-bold text-secondary">
                 {stats?.totalProjects || 0}
               </span>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Dashboard;
