import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Mail,
  MailOpen,
  Trash2,
  Clock,
  User,
  Search,
  RefreshCcw,
  MessageSquare,
  ChevronRight,
  Inbox,
  Sparkles,
} from "lucide-react";
import { contactAPI } from "../../api";
import { ConfirmModal } from "../../components/ui/Modal";

const ManageMessages = () => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["messages"],
    queryFn: () => contactAPI.getAll().then((r) => r.data),
  });

  const messages = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];
  const unreadCount =
    data?.unreadCount || messages.filter((msg) => !msg.isRead).length || 0;

  const filteredMessages = messages.filter((msg) => {
    const q = search.toLowerCase();
    return (
      msg?.name?.toLowerCase().includes(q) ||
      msg?.email?.toLowerCase().includes(q) ||
      msg?.subject?.toLowerCase().includes(q)
    );
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["messages"] });

  const readMutation = useMutation({
    mutationFn: contactAPI.markAsRead,
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: contactAPI.delete,
    onSuccess: () => {
      toast.success("Message deleted successfully");
      invalidate();
      setDeleteId(null);
      if (selectedMsg?._id === deleteId) setSelectedMsg(null);
    },
  });

  const handleOpen = (msg) => {
    setSelectedMsg(msg);
    if (!msg.isRead) readMutation.mutate(msg._id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Mail className="text-primary" size={28} />
            Inbox Messages
          </h2>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="badge badge-primary badge-lg gap-1 px-4 py-3">
              <MessageSquare size={14} />
              {messages.length} Total
            </div>
            {unreadCount > 0 && (
              <div className="badge badge-error badge-lg gap-1 px-4 py-3">
                <Mail size={14} />
                {unreadCount} Unread
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="input input-bordered flex items-center gap-2 rounded-xl bg-base-100/50">
            <Search size={16} className="text-base-content/40" />
            <input
              type="text"
              className="grow"
              placeholder="Search by name, email, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button
            onClick={refetch}
            className={`btn btn-outline rounded-xl gap-2 ${
              isFetching ? "loading" : ""
            }`}
          >
            {!isFetching && <RefreshCcw size={16} />}
            {!isFetching && "Refresh"}
          </button>
        </div>
      </div>

      {/* Loading / Empty / Main Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="card bg-base-100/60 backdrop-blur-sm public-card rounded-3xl p-16 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Inbox size={42} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No messages found</h3>
          <p className="text-base-content/60">
            {search
              ? "Try a different search term."
              : "Your inbox is currently empty."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6">
          {/* Messages Sidebar */}
          <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-4 shadow-md h-[75vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                Conversations
              </h3>
              <div className="badge badge-primary badge-sm">
                {filteredMessages.length}
              </div>
            </div>
            <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => handleOpen(msg)}
                  className={`group rounded-2xl p-4 cursor-pointer public-card transition-all duration-200 ${
                    selectedMsg?._id === msg._id
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-base-200 hover:border-primary/40 hover:bg-base-200/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                        msg.isRead
                          ? "bg-base-400/50"
                          : "bg-linear-to-br from-primary to-secondary"
                      }`}
                    >
                      {msg?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-semibold truncate ${
                            !msg.isRead ? "text-primary" : ""
                          }`}
                        >
                          {msg.name}
                        </p>
                        {!msg.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm font-medium truncate mt-1">
                        {msg.subject}
                      </p>
                      <p className="text-xs text-base-content/50 truncate mt-1">
                        {msg.email}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-base-content/40 mt-2">
                        <Clock size={11} />
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-base-content/30 group-hover:text-primary transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Viewer */}
          <div className="card bg-base-100/80 backdrop-blur-sm public-card rounded-3xl p-6 shadow-md">
            {selectedMsg ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold leading-tight">
                      {selectedMsg.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/60 mt-3">
                      <User size={14} />
                      <span>{selectedMsg.name}</span>
                      <span>•</span>
                      <a
                        href={`mailto:${selectedMsg.email}`}
                        className="text-primary hover:underline"
                      >
                        {selectedMsg.email}
                      </a>
                    </div>
                    <div className="text-xs text-base-content/40 mt-2">
                      {new Date(selectedMsg.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteId(selectedMsg._id)}
                    className="btn btn-error btn-outline btn-sm rounded-xl gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedMsg.isRead ? (
                    <div className="badge badge-success gap-1 px-3 py-2">
                      <MailOpen size={12} />
                      Read
                    </div>
                  ) : (
                    <div className="badge badge-primary gap-1 px-3 py-2">
                      <Mail size={12} />
                      Unread
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-base-200/70 public-card p-6">
                  <p className="leading-relaxed whitespace-pre-wrap text-[15px]">
                    {selectedMsg.message}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                    className="btn btn-primary rounded-xl flex-1 gap-2 shadow-md"
                  >
                    <Mail size={16} />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => setDeleteId(selectedMsg._id)}
                    className="btn btn-outline btn-error rounded-xl gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Mail size={42} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">No message selected</h3>
                <p className="text-base-content/60 max-w-sm">
                  Choose a message from the left sidebar to read its content.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
      />
    </div>
  );
};

export default ManageMessages;
