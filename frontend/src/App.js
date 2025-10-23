import React, { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import VerifyForm from "./components/VerifyForm";
import StatusCheck from "./components/StatusCheck";
import { Toaster } from "react-hot-toast";

function App() {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-black text-white relative overflow-hidden">
      <Toaster 
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    duration: 6000,
    style: {
      background: 'rgba(30,11,60,0.95)',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
      whiteSpace: 'pre-wrap',       // allow line breaks
      wordBreak: 'break-word',      // wrap long words / hashes
      maxWidth: '350px',            // restrict width so it wraps nicely
    },
  }}
/>

      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,59,255,0.3),transparent_60%)] blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,80,255,0.2),transparent_70%)] blur-3xl"></div>

      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-violet-500 to-indigo-400 drop-shadow-[0_0_25px_rgba(139,92,246,0.5)]">
        Know Your Customer
      </h1>

      {/* Tabs */}
      <div className="flex gap-6 mb-10">
        {["register", "verify", "status"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-md ${
              activeTab === tab
                ? "bg-gradient-to-r from-fuchsia-600 via-violet-600 to-purple-700 shadow-[0_0_25px_rgba(139,92,246,0.6)] scale-105"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Form Container */}
      <div className="w-full max-w-xl p-10 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-2xl shadow-2xl min-h-[400px] flex flex-col justify-center transition-all duration-300">
        {activeTab === "register" && <RegisterForm />}
        {activeTab === "verify" && <VerifyForm />}
        {activeTab === "status" && <StatusCheck />}
      </div>

      {/* Footer */}
      <p className="mt-10 text-white/50 text-sm">
        Developed by Team 14. Blockchain Technology - Know Your Customer (KYC).
      </p>
    </div>
  );
}

export default App;
