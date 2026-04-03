import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Toast from "react-hot-toast";
import Ticket from "./Ticket";
import { supabase } from "./createClient";

function AdminTicketGenerateNew({ name, sessionId, bannerUrl }) {
  const [uuid, setUuid] = useState("");
  const [inputName, setInputName] = useState(name);

  useEffect(() => {
    setInputName(name);
  }, [name]);

  useEffect(() => {
    generateTicketNow();
  }, []);

  const generateTicketNow = async () => {
    const uuidGenerated = uuidv4();
    setUuid(uuidGenerated);
    const success = await uploadTicket(uuidGenerated, inputName);
    if (success) Toast.success("Ticket generated!");
    else Toast.error("Failed to generate ticket.");
  };

  const uploadTicket = async (uuid, name) => {
    try {
      const updatePayload = { uuid, isGenerated: true };
      if (sessionId) updatePayload.session_id = sessionId;

      const { error } = await supabase
        .from("tickets")
        .update(updatePayload)
        .match({ name });

      if (error) { console.error(error); return false; }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3">🎫 Generating Ticket</h3>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700">
          {inputName}
        </div>
      </div>
      {uuid && (
        <div className="mt-2">
          <Ticket name={inputName} uuid={uuid} width={280} bannerUrl={bannerUrl} />
        </div>
      )}
    </div>
  );
}

export default AdminTicketGenerateNew;
