import React, { useState } from "react";
import axios from "axios";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
export default function RegisterForm() {
  const [name, setName] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [document, setDocument] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!name || !ethAddress || !document) return toast.error("Please fill all fields");

  setLoading(true);
  const formData = new FormData();
  formData.append("name", name);
  formData.append("ethAddress", ethAddress);
  formData.append("document", document);

  try {
    const res = await axios.post("http://localhost:4000/api/kyc/register", formData);
    toast.success(`User Registered! ID: ${res.data.userId}`);
    setResult(res.data); // optional, you can keep it if you want to store result
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Error registering user");
  } finally {
    setLoading(false);
  }
};

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        className="p-4 rounded-xl bg-white/10 text-white placeholder-white/70 border border-violet-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ethereum Address"
        className="p-4 rounded-xl bg-white/10 text-white placeholder-white/70 border border-violet-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
        value={ethAddress}
        onChange={(e) => setEthAddress(e.target.value)}
      />

      <label className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-violet-500 cursor-pointer hover:bg-white/20 transition">
        <PaperClipIcon className="w-6 h-6 text-fuchsia-400" />
        <span>{document ? document.name : "Upload Document"}</span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => setDocument(e.target.files[0])}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-600 to-purple-700 hover:from-fuchsia-600 hover:to-violet-800 font-semibold shadow-[0_0_20px_rgba(155,59,255,0.5)] transition-all"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {result && (
        <div className="mt-6 p-4 rounded-xl bg-white/10 border border-fuchsia-400">
          <pre className="text-sm text-white/80 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}
