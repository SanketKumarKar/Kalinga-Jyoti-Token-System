import React, { useState, useEffect, createRef } from "react";
import AdminDashboard from "../components/AdminDashboard";
import AdminAllTicket from "../components/AdminAllTicket";
import AdminTicketStatus from "../components/AdminTicketStatus";
import AddUsers from "../components/AdminAddUser";
import AdminSessionManager from "../components/AdminSessionManager";
import { SessionProvider, useSession } from "../context/SessionContext";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const PIN = "024680";

const AdminContent = () => {
  const { activeSession, dbError } = useSession();
  const [pin, setPin] = useState(Array(6).fill(""));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const inputRefs = Array(6).fill().map(() => createRef());

  useEffect(() => {
    const authTime = localStorage.getItem("adminAuthTime");
    if (authTime && Date.now() - Number(authTime) < 30 * 60 * 1000) {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinChange = (digit, i) => {
    const newPin = [...pin];
    newPin[i] = digit;
    setPin(newPin);
    if (newPin.join("") === PIN) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthTime", Date.now().toString());
    } else if (digit !== "" && i < pin.length - 1) {
      inputRefs[i + 1].current?.focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && i > 0 && pin[i] === "") {
      inputRefs[i - 1].current?.focus();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin(Array(6).fill(""));
    localStorage.removeItem("adminAuthTime");
  };

  if (dbError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-md w-full shadow-2xl">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-500/30">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Database Paused ⏸️</h2>
          <p className="text-red-200 text-sm mb-6 leading-relaxed">
            The Supabase database for this project is currently paused due to inactivity. Tickets cannot be generated, imported, or viewed.
          </p>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="inline-block w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/30">
            Go to Supabase to Restore
          </a>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 to-red-950 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-orange-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 font-serif">Admin Portal</h2>
            <p className="text-orange-700 text-sm mt-1 font-medium">Jay Jagannath 🙏</p>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="password"
                value={digit}
                onChange={(e) => handlePinChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-11 h-12 text-center text-lg font-bold border-2 border-orange-200 focus:border-red-500 rounded-xl outline-none transition-colors"
                maxLength="1"
              />
            ))}
          </div>
          {!pin.includes("") && pin.join("") !== PIN && (
            <p className="text-center text-red-600 text-sm font-bold">Incorrect PIN. Try again.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50/50">
      {/* Top Nav */}
      <nav className="fixed w-full z-20 top-0 bg-red-950 border-b border-orange-900 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-bold font-serif">KJ</span>
            </div>
            <span className="text-orange-50 font-bold font-serif hidden sm:inline">Admin Dashboard</span>
            {activeSession && (
              <span className="px-2.5 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold rounded-full ml-2">
                🟢 {activeSession.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/" className="text-sm font-medium text-orange-200 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors hidden sm:block">Home</Link>
            <Link to="/scan" className="text-sm font-medium text-amber-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Scan</Link>
            <a href="#sessions" className="text-sm font-medium text-orange-200 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Sessions</a>
            <a href="#adduser" className="text-sm font-medium text-orange-200 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Upload</a>
            <a href="#generate" className="text-sm font-medium text-orange-200 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors hidden md:block">Generate</a>
            <a href="#alltickets" className="text-sm font-medium text-orange-200 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors hidden md:block">View All</a>
            <a href="#status" className="text-sm font-medium text-orange-200 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors hidden lg:block">Status</a>
            <button onClick={handleLogout} className="text-sm font-bold text-red-300 hover:text-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500/20 shadow-inner transition-colors ml-2">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="pt-14" />

      {/* Content */}
      <div id="sessions" className="scroll-mt-16">
        <AdminSessionManager />
      </div>
      <div id="adduser" className="scroll-mt-16">
        <AddUsers />
      </div>
      <div id="generate" className="scroll-mt-16">
        <AdminDashboard />
      </div>
      <div id="alltickets" className="scroll-mt-16">
        <AdminAllTicket />
      </div>
      <div id="status" className="scroll-mt-16">
        <AdminTicketStatus />
      </div>
    </div>
  );
};

const Admin = () => (
  <SessionProvider>
    <Toaster position="top-right" />
    <AdminContent />
  </SessionProvider>
);

export default Admin;
