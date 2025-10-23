import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
export default function StatusCheck() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
  if (!address) return toast.error("Enter an address");

  setLoading(true);
  try {
    const res = await axios.get(`http://localhost:4000/api/kyc/status/${address}`);
    toast.success(`Status: ${res.data.verified ? "Verified" : "Unverified"}`);
    setStatus(res.data); // optional
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Error fetching status");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col gap-6">
      <input
        type="text"
        placeholder="Ethereum Address"
        className="p-4 rounded-xl bg-white/10 text-white placeholder-white/70 border border-violet-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        onClick={handleCheck}
        className="py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-600 to-purple-700 hover:from-fuchsia-600 hover:to-violet-800 font-semibold shadow-[0_0_20px_rgba(155,59,255,0.5)] transition-all"
      >
        {loading ? "Checking..." : "Check Status"}
      </button>

      {status && (
        <div className="mt-4 p-4 rounded-xl bg-white/10 border border-fuchsia-400">
          <pre className="text-sm text-white/80">{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
