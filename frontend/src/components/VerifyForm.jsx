import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
export default function VerifyForm() {
  const [userId, setUserId] = useState("");
  const [verified, setVerified] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!userId) return toast.error("User ID is required");

  setLoading(true);
  try {
    const res = await axios.post(
      "http://localhost:4000/api/kyc/verify",
      { userId, verified },
      { headers: { "x-api-key": "psg_api_1234" } }
    );
    toast.success(`Verification successful! TxHash: ${res.data.txHash}`);
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Error verifying user");
  } finally {
    setLoading(false);
  }
};

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="User ID"
        className="p-4 rounded-xl bg-white/10 text-white placeholder-white/70 border border-violet-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <select
        value={verified}
        onChange={(e) => setVerified(e.target.value === "true")}
        className="p-4 rounded-xl bg-white/10 text-white border border-violet-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
      >
        <option value="true">Verified</option>
        <option value="false">Unverified</option>
      </select>
      <button
        type="submit"
        className="py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-600 to-purple-700 hover:from-fuchsia-600 hover:to-violet-800 font-semibold shadow-[0_0_20px_rgba(155,59,255,0.5)] transition-all"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-white/10 border border-fuchsia-400">
          <pre className="text-sm text-white/80">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}
