import React, { useState, useRef } from "react";
import Toast from "react-hot-toast";
import { supabase } from "./createClient";
import { useSession } from "../context/SessionContext";

const AdminSessionManager = () => {
  const { sessions, activeSession, refreshSessions, activateSession } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", sheetbest_url: "" });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileRef = useRef(null);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const uploadBanner = async (file, sessionId) => {
    const ext = file.name.split(".").pop();
    const path = `${sessionId}/banner.${ext}`;
    const { error } = await supabase.storage.from("banners").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("banners").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return Toast.error("Session name is required");
    setUploading(true);
    try {
      const { data: session, error: insertErr } = await supabase
        .from("sessions")
        .insert({ name: formData.name, description: formData.description, sheetbest_url: formData.sheetbest_url })
        .select()
        .single();
      if (insertErr) throw insertErr;

      let banner_url = null;
      if (bannerFile) {
        banner_url = await uploadBanner(bannerFile, session.id);
        await supabase.from("sessions").update({ banner_url }).eq("id", session.id);
      }

      Toast.success("Session created successfully!");
      setFormData({ name: "", description: "", sheetbest_url: "" });
      setBannerFile(null);
      setBannerPreview(null);
      setCreating(false);
      await refreshSessions();
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        Toast.error("Failed to fetch. Did you run the SQL Migration in Supabase? The sessions table or buckets might be missing.");
      } else {
        Toast.error("Error: " + err.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateSession = async (sessionId, updates) => {
    const { error } = await supabase.from("sessions").update(updates).eq("id", sessionId);
    if (error) Toast.error("Update failed: " + error.message);
    else { Toast.success("Session updated!"); await refreshSessions(); }
  };

  const handleBannerUpdate = async (sessionId, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadBanner(file, sessionId);
      await handleUpdateSession(sessionId, { banner_url: url });
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        Toast.error("Banner upload failed! Did you create the 'banners' storage bucket using the SQL script?");
      } else {
        Toast.error("Banner upload failed: " + err.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (sessionId) => {
    const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
    if (error) Toast.error("Delete failed: " + error.message);
    else { Toast.success("Session deleted"); setDeleteConfirm(null); await refreshSessions(); }
  };

  return (
    <div className="border-b-2 border-gray-200 bg-white">
      {/* Header Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-orange-50/50 hover:bg-orange-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="text-left">
            <h2 className="font-bold text-gray-800 text-sm">Session Manager</h2>
            <p className="text-xs text-gray-500">
              {activeSession ? `Active: ${activeSession.name}` : "No active session"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeSession && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""}
            </span>
          )}
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          {/* Create New Button */}
          <button
            onClick={() => setCreating(!creating)}
            className="mb-4 mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {creating ? "Cancel" : "Create New Session"}
          </button>

          {/* Create Form */}
          {creating && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 mb-5 space-y-4">
              <h3 className="font-bold text-orange-900 text-sm font-serif">New Event Session</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-orange-800 mb-1">Event Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Annual Fest 2025"
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-orange-800 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Optional event description"
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-orange-800 mb-1">SheetBest API URL</label>
                <input
                  type="url"
                  value={formData.sheetbest_url}
                  onChange={(e) => setFormData((p) => ({ ...p, sheetbest_url: e.target.value }))}
                  placeholder="https://api.sheetbest.com/sheets/..."
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-orange-800 mb-1">Banner Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors bg-white/50"
                >
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner preview" className="max-h-32 mx-auto rounded-lg object-cover shadow-md" />
                  ) : (
                    <div className="text-orange-400">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-medium">Click to upload traditional banner image</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={uploading}
                className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-all shadow-md"
              >
                {uploading ? "Creating…" : "Create Session"}
              </button>
            </div>
          )}

          {/* Sessions List */}
          <div className="space-y-3">
            {sessions.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-6">No sessions yet. Create one above.</p>
            )}
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isActive={activeSession?.id === session.id}
                onActivate={() => activateSession(session.id).then(() => Toast.success(`"${session.name}" is now active`))}
                onDelete={() => setDeleteConfirm(session.id)}
                onUpdateBanner={(file) => handleBannerUpdate(session.id, file)}
                onUpdateSheetbest={(url) => handleUpdateSession(session.id, { sheetbest_url: url })}
                uploading={uploading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete Session?</h3>
            <p className="text-gray-500 text-sm mb-5">
              All tickets in this session will also be deleted. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SessionCard = ({ session, isActive, onActivate, onDelete, onUpdateBanner, onUpdateSheetbest, uploading }) => {
  const [editingSheetbest, setEditingSheetbest] = useState(false);
  const [sheetbestVal, setSheetbestVal] = useState(session.sheetbest_url || "");
  const bannerInputRef = useRef(null);

  const saveSheetbest = () => {
    onUpdateSheetbest(sheetbestVal);
    setEditingSheetbest(false);
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all shadow-sm ${isActive ? "border-green-500 bg-green-50" : "border-orange-200 bg-white hover:border-orange-300"}`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          {/* Banner Thumbnail */}
          <div
            onClick={() => bannerInputRef.current?.click()}
            title="Click to change banner"
            className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-200 cursor-pointer group flex-shrink-0"
          >
            {session.banner_url ? (
              <img src={session.banner_url} alt="banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onUpdateBanner(e.target.files[0])} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-800 text-sm truncate">{session.name}</h4>
              {isActive && <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full flex-shrink-0">ACTIVE</span>}
            </div>
            {session.description && <p className="text-xs text-gray-500 truncate">{session.description}</p>}
            <p className="text-xs text-gray-400">{new Date(session.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isActive && (
            <button onClick={onActivate} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm">
              Activate
            </button>
          )}
          <button onClick={onDelete} className="px-3 py-1.5 border border-red-300 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg transition-colors">
            Delete
          </button>
        </div>
      </div>

      {/* SheetBest URL */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-500">SheetBest API URL</label>
          {!editingSheetbest ? (
            <button onClick={() => setEditingSheetbest(true)} className="text-xs text-orange-600 hover:underline">Edit</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveSheetbest} className="text-xs text-green-600 font-semibold hover:underline">Save</button>
              <button onClick={() => setEditingSheetbest(false)} className="text-xs text-gray-500 hover:underline">Cancel</button>
            </div>
          )}
        </div>
        {editingSheetbest ? (
          <input
            type="url"
            value={sheetbestVal}
            onChange={(e) => setSheetbestVal(e.target.value)}
            placeholder="https://api.sheetbest.com/sheets/..."
            className="w-full px-3 py-1.5 text-xs font-mono border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        ) : (
          <p className="text-xs font-mono text-gray-500 truncate">
            {session.sheetbest_url || <span className="italic text-gray-400">Not set</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminSessionManager;
