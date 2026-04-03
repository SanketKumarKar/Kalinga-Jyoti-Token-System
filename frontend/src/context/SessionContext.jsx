import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../components/createClient";

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  const refreshSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        if (error.message && (error.message.includes("Failed to fetch") || error.code === 'PGRST301' || error.message.includes("503"))) {
          setDbError(true);
        }
      } else if (data) {
        setDbError(false);
        setSessions(data);
        const active = data.find((s) => s.is_active);
        setActiveSession(active || null);
      }
    } catch (err) {
      if (err.message && err.message.includes("Failed to fetch")) setDbError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const activateSession = async (sessionId) => {
    // Deactivate all
    await supabase.from("sessions").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    // Activate selected
    const { error } = await supabase.from("sessions").update({ is_active: true }).eq("id", sessionId);
    if (!error) await refreshSessions();
    return !error;
  };

  return (
    <SessionContext.Provider value={{ sessions, activeSession, loading, dbError, refreshSessions, activateSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
};
