import React, { useState, useEffect } from "react";
import { supabase } from "../components/createClient";
import AdminTicketGenerateNew from "./AdminTicketGenerateNew";
import Ticket from "./Ticket";
import Toast from "react-hot-toast";
import { QRCode } from "react-qr-code";
import { useSession } from "../context/SessionContext";

const AdminDashboard = () => {
  const { activeSession } = useSession();
  const [tickets, setTickets] = useState([]);
  const [generatingTicket, setGeneratingTicket] = useState(null);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRegNo, setNewRegNo] = useState("");
  const [editingTicket, setEditingTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [counts, setCounts] = useState({ all: 0, generated: 0, notGenerated: 0 });

  useEffect(() => {
    if (activeSession) fetchTickets();
  }, [activeSession, searchTerm]);

  const fetchTickets = async () => {
    if (!activeSession) return;
    let query = supabase
      .from("tickets")
      .select("name, email, isGenerated, uuid, reg_no")
      .eq("session_id", activeSession.id)
      .order("name", { ascending: true });

    if (searchTerm) query = query.ilike("name", `%${searchTerm}%`);

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching tickets:", error);
    } else {
      setTickets(data);
      setCounts({
        all: data.length,
        generated: data.filter((t) => t.isGenerated).length,
        notGenerated: data.filter((t) => !t.isGenerated).length,
      });
    }
  };

  const handleGenerateTicket = (name) => {
    setGeneratingTicket({ name });
    setViewingTicket(null);
    setTimeout(() => setGeneratingTicket(null), 2000);
  };

  const handleShowTicket = async (uuid) => {
    const { data, error } = await supabase.from("tickets").select("name,uuid").eq("uuid", uuid);
    if (!error) {
      setViewingTicket(data[0]);
      setGeneratingTicket(null);
      fetchTickets();
    }
  };

  const handleAddTicket = async () => {
    if (!activeSession) return Toast.error("No active session selected");
    if (!newName.trim() || !newEmail.trim()) return;

    if (editingTicket) {
      const { error } = await supabase
        .from("tickets")
        .update({ name: newName.toUpperCase(), email: newEmail, reg_no: newRegNo.toUpperCase() })
        .eq("uuid", editingTicket.uuid);
      if (error) { Toast.error("Error updating ticket"); return; }
      Toast.success("Ticket updated");
    } else {
      const { error } = await supabase.from("tickets").insert([{
        name: newName.toUpperCase(),
        email: newEmail,
        reg_no: newRegNo.toUpperCase(),
        isGenerated: false,
        session_id: activeSession.id,
      }]);
      if (error) { Toast.error("Error adding ticket"); return; }
      Toast.success("Ticket added");
    }
    setNewName(""); setNewEmail(""); setNewRegNo(""); setEditingTicket(null);
    fetchTickets();
  };

  const handleEditTicket = (ticket) => {
    setNewName(ticket.name); setNewEmail(ticket.email); setNewRegNo(ticket.reg_no);
    setEditingTicket(ticket);
  };

  const handleDeleteTicket = async (uuid) => {
    const { error } = await supabase.from("tickets").delete().eq("uuid", uuid);
    if (error) Toast.error("Error deleting ticket");
    else { Toast.success("Ticket deleted"); fetchTickets(); }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Toast.success("Link copied to clipboard");
  };

  const ticketUrl = (ticket) =>
    `${window.location.origin}/token/${ticket.name}/${ticket.uuid}`;

  const filteredTickets = tickets.filter((t) => {
    if (filter === "generated") return t.isGenerated;
    if (filter === "notGenerated") return !t.isGenerated;
    return true;
  });

  if (!activeSession) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-700 text-lg mb-1">No Active Session</h3>
        <p className="text-gray-500 text-sm">Create or activate a session using the Session Manager above.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 min-h-[calc(100vh-64px)] bg-transparent p-4 flex-col lg:flex-row" id="generate">
      {/* Left Panel - Ticket List */}
      <div className="flex-1 min-w-0">
        {/* Active Session Banner */}
        <div className="mb-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-md">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          <span className="font-medium font-serif text-sm">
            Active Event: <span className="font-bold">{activeSession.name}</span>
          </span>
          <span className="text-orange-200 text-xs ml-auto font-semibold">{counts.all} attendees</span>
        </div>

        {/* Add / Edit Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            {editingTicket ? "✏️ Edit Attendee" : "➕ Add Attendee"}
          </h3>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full Name"
              className="flex-1 min-w-[140px] px-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 min-w-[160px] px-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              value={newRegNo}
              onChange={(e) => setNewRegNo(e.target.value)}
              placeholder="Reg. No."
              className="flex-1 min-w-[120px] px-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleAddTicket}
              className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md ${
                editingTicket ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {editingTicket ? "Save Edit" : "Add Attendee"}
            </button>
            {editingTicket && (
              <button
                onClick={() => { setNewName(""); setNewEmail(""); setNewRegNo(""); setEditingTicket(null); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 shadow-sm flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name…"
              className="w-full pl-9 pr-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {[
              { key: "all", label: "All", count: counts.all, colors: "bg-orange-600 text-white" },
              { key: "generated", label: "Generated", count: counts.generated, colors: "bg-green-500 text-white" },
              { key: "notGenerated", label: "Pending", count: counts.notGenerated, colors: "bg-rose-500 text-white" },
            ].map(({ key, label, count, colors }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === key ? colors : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === key ? "bg-white/30" : "bg-gray-100"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Name", "Reg. No.", "Email", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400 text-sm">
                    No attendees found.
                  </td>
                </tr>
              )}
              {filteredTickets.map((ticket, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{ticket.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{ticket.reg_no}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{ticket.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {ticket.isGenerated ? (
                        <>
                          <ActionBtn onClick={() => handleShowTicket(ticket.uuid)} color="blue" label="View" />
                          <ActionBtn onClick={() => handleGenerateTicket(ticket.name)} color="amber" label="Regen" />
                          <ActionBtn onClick={() => handleEditTicket(ticket)} color="yellow" label="Edit" />
                          <ActionBtn onClick={() => handleCopyToClipboard(ticketUrl(ticket))} color="cyan" label="Copy Link" />
                        </>
                      ) : (
                        <ActionBtn onClick={() => handleGenerateTicket(ticket.name)} color="green" label="Generate" />
                      )}
                      <ActionBtn onClick={() => handleDeleteTicket(ticket.uuid)} color="red" label="Del" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel - Ticket Preview */}
      <div className="w-full lg:w-[450px] flex-shrink-0 lg:p-4">
        <div className="sticky top-4">
          {generatingTicket && (
            <AdminTicketGenerateNew
              name={generatingTicket.name}
              sessionId={activeSession.id}
              bannerUrl={activeSession.banner_url}
            />
          )}
          {viewingTicket && !generatingTicket && (
            <div className="bg-white rounded-xl border border-orange-200 shadow-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <h3 className="text-sm font-bold text-gray-700 mb-3 font-serif">🎫 Ticket Preview</h3>
              <Ticket
                name={viewingTicket.name}
                uuid={viewingTicket.uuid}
                bannerUrl={activeSession.banner_url}
              />
              <p className="text-xs font-semibold text-gray-500 text-center mt-4 mb-2">Token Download QR Code</p>
              <div className="flex justify-center">
                <QRCode
                  level="L"
                  style={{ width: "140px", height: "140px" }}
                  value={ticketUrl(viewingTicket)}
                />
              </div>
              <button
                onClick={() => handleCopyToClipboard(ticketUrl(viewingTicket))}
                className="w-full mt-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                Copy Public Link
              </button>
            </div>
          )}
          {!generatingTicket && !viewingTicket && (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <p className="text-gray-400 text-sm">Select an attendee to view or generate their ticket</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionBtn = ({ onClick, color, label }) => {
  const colors = {
    blue: "border-blue-400 text-blue-600 hover:bg-blue-50",
    amber: "border-amber-400 text-amber-600 hover:bg-amber-50",
    yellow: "border-yellow-400 text-yellow-600 hover:bg-yellow-50",
    cyan: "border-cyan-400 text-cyan-600 hover:bg-cyan-50",
    green: "border-green-400 text-green-600 hover:bg-green-50",
    red: "border-red-400 text-red-600 hover:bg-red-50",
  };
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 border rounded text-xs font-semibold transition-colors ${colors[color]}`}
    >
      {label}
    </button>
  );
};

export default AdminDashboard;
