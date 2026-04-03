import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Ticket from "../components/Ticket";
import { supabase } from "../components/createClient";
import html2canvas from "html2canvas";

const PublicTokenViewer = () => {
  const { name, uuid } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchTicketAndSession = async () => {
      setLoading(true);
      try {
        // Fetch ticket with its session
        const { data, error } = await supabase
          .from("tickets")
          .select("name, uuid, reg_no, sessions(name, banner_url, description)")
          .eq("name", name)
          .eq("uuid", uuid)
          .single();

        if (error || !data) throw error || new Error("Ticket not found");

        setTicketData(data);
        if (data.sessions?.banner_url) setBannerUrl(data.sessions.banner_url);
      } catch (err) {
        console.error("Error loading ticket:", err);
        setTicketData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketAndSession();
  }, [name, uuid]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(ticketRef.current, { scale: 3, useCORS: true });
      const link = document.createElement("a");
      link.download = `ticket-${name.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-300 text-sm font-medium">Loading your ticket…</p>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-10 text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Ticket Not Found</h2>
          <p className="text-gray-400 text-sm">This ticket link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const sessionName = ticketData.sessions?.name;
  const sessionDesc = ticketData.sessions?.description;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center px-4 py-10">
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Event Header */}
        <div className="text-center mb-6 animate-fade-in">
          {sessionName && (
            <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-1">
              🎟 {sessionName}
            </p>
          )}
          <h1 className="text-white text-2xl md:text-3xl font-bold">Your Event Ticket</h1>
          {sessionDesc && <p className="text-gray-400 text-sm mt-1">{sessionDesc}</p>}
        </div>

        {/* Ticket Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl">
          {/* Attendee info */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{name?.charAt(0)}</span>
            </div>
            <div>
              <p className="text-white font-bold text-base">{name}</p>
              {ticketData.reg_no && <p className="text-gray-400 text-xs">{ticketData.reg_no}</p>}
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold rounded-full">
                ✓ Valid
              </span>
            </div>
          </div>

          {/* Ticket visual */}
          <div ref={ticketRef} className="rounded-2xl overflow-hidden">
            <Ticket
              name={name}
              uuid={uuid}
              bannerUrl={bannerUrl}
            />
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Preparing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Ticket
              </>
            )}
          </button>
          <p className="text-center text-gray-500 text-xs mt-3">Save this ticket to your device. You'll need it at the event.</p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Powered by Kalinga Jyoti Token System
        </p>
      </div>
    </div>
  );
};

export default PublicTokenViewer;
