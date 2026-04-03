import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../components/createClient";
import Toast from "react-hot-toast";
import { useSession } from "../context/SessionContext";

const AddUsers = () => {
  const { activeSession } = useSession();
  const [data, setData] = useState([]);
  const [columnMapping, setColumnMapping] = useState({ name: "", email: "", reg_no: "" });
  const [filteredData, setFilteredData] = useState([]);
  const [currentStep, setCurrentStep] = useState("uploadFile");
  const [startRow, setStartRow] = useState(11);
  const [endRow, setEndRow] = useState(300);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = jsonData[startRow - 1];
      const parsedData = jsonData.slice(startRow, endRow).map((row) => {
        const obj = {};
        headers.forEach((header, index) => { obj[header] = row[index]; });
        return obj;
      });
      const nonEmptyRows = parsedData.filter((row) =>
        Object.values(row).every((cell) => cell !== "" && cell !== undefined)
      );
      setData(nonEmptyRows);
      setColumnMapping({ name: "", email: "", reg_no: "" });
      setFilteredData(nonEmptyRows);
      setCurrentStep("mapColumns");
      Toast.success("File uploaded successfully");
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleColumnChange = (e, columnName) => {
    setColumnMapping((prev) => ({ ...prev, [columnName]: e.target.value }));
  };

  const handleFilter = () => {
    const filtered = data.filter((row) =>
      columnMapping.name && row[columnMapping.name] !== "" &&
      columnMapping.email && row[columnMapping.email] !== "" &&
      columnMapping.reg_no && row[columnMapping.reg_no] !== ""
    );
    setFilteredData(filtered);
    setCurrentStep("filtered");
    Toast.success("Data filtered successfully");
  };

  const getSupabaseField = (excelHeader) => {
    const found = Object.entries(columnMapping).find(([, v]) => v === excelHeader);
    return found ? found[0] : null;
  };

  const uploadUsers = async () => {
    if (!activeSession) return Toast.error("No active session selected");
    const usersToUpload = filteredData.map((row) => {
      const user = { session_id: activeSession.id };
      Object.keys(row).forEach((key) => {
        const field = getSupabaseField(key);
        if (field) {
          let value = row[key];
          if (field === "name" || field === "reg_no") value = value.toString().toUpperCase();
          user[field] = value;
        }
      });
      return user;
    });

    for (const user of usersToUpload) {
      const { data: existing } = await supabase
        .from("tickets")
        .select("*")
        .eq("name", user.name)
        .eq("session_id", activeSession.id)
        .single();

      if (!existing) {
        const { error } = await supabase.from("tickets").insert(user);
        if (error) Toast.error(`Error: ${user.name} — ${error.message}`);
        else Toast.success(`${user.name} added`);
      } else {
        Toast.error(`${user.name} already exists in this session`);
      }
    }
  };

  return (
    <div className="border-b-2 border-gray-200 bg-white" id="adduser">
      <button
        onClick={() => setShowBulkUpload(!showBulkUpload)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-left">
            <h2 className="font-bold text-gray-800 text-sm">Bulk Add Users</h2>
            <p className="text-xs text-gray-500">Upload an Excel file to add multiple attendees</p>
          </div>
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${showBulkUpload ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showBulkUpload && (
        <div className="px-6 pb-6">
          {!activeSession && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-4 py-2 mb-4">
              ⚠️ Please activate a session first before adding users.
            </div>
          )}

          {currentStep === "uploadFile" && (
            <div className="space-y-3">
              <div className="flex gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Header Row</label>
                  <input type="number" value={startRow} onChange={(e) => setStartRow(Number(e.target.value))}
                    className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">End Row</label>
                  <input type="number" value={endRow} onChange={(e) => setEndRow(Number(e.target.value))}
                    className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-green-400 transition-colors">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-gray-500">Click to upload Excel (.xlsx)</span>
                <span className="text-xs text-gray-400 mt-1">Headers in row {startRow}, data from row {startRow + 1}</span>
                <input type="file" accept=".xlsx" onChange={handleFileUpload} className="hidden" />
              </label>
              <img src="/example1.png" alt="Excel format example" className="max-w-xs rounded-lg border border-gray-200 mx-auto block" />
            </div>
          )}

          {data.length > 0 && currentStep === "mapColumns" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700">Map Columns</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Name", field: "name" },
                  { label: "Email", field: "email" },
                  { label: "Reg. No.", field: "reg_no" },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <select
                      onChange={(e) => handleColumnChange(e, field)}
                      value={columnMapping[field] || ""}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Select…</option>
                      {Object.keys(data[0]).map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCurrentStep("uploadFile")} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Back</button>
                <button onClick={handleFilter} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold">Preview & Filter</button>
              </div>
            </div>
          )}

          {currentStep === "filtered" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">{filteredData.length} rows to upload</h3>
                <div className="flex gap-3">
                  <button onClick={() => setCurrentStep("mapColumns")} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Back</button>
                  <button onClick={uploadUsers} disabled={!activeSession} className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold">
                    Upload to Session
                  </button>
                </div>
              </div>
              <div className="overflow-auto max-h-64 border border-gray-200 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Name", "Email", "Reg. No."].map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredData.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-700">{row[columnMapping.name]}</td>
                        <td className="px-3 py-2 text-gray-700">{row[columnMapping.email]}</td>
                        <td className="px-3 py-2 text-gray-700">{row[columnMapping.reg_no]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddUsers;
