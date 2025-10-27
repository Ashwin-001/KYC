import React, { useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

const CONTRACT_ADDRESS = "your_contract_address";  
const ABI = [
  "function setKycStatus(address user, bool verified, string ipfsHash) public"
];

export default function VerifyForm() {
  const [userAddress, setUserAddress] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!userAddress || !ipfsHash) return toast.error("Fill all fields");

    try {
      if (!window.ethereum) return toast.error("MetaMask not detected");

      setLoading(true);

      // Request wallet access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Check network (Sepolia chainId = 11155111)
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // Hex for Sepolia
        });
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Call contract
      const tx = await contract.setKycStatus(userAddress, true, ipfsHash);
      toast.loading("Transaction submitted... waiting for confirmation");

      const receipt = await tx.wait();
      toast.dismiss();
      toast.success(`✅ Verified! Tx: ${receipt.transactionHash}`);

      setUserAddress("");
      setIpfsHash("");
    } catch (err) {
      console.error(err);
      toast.error(err.reason || err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <input
        type="text"
        placeholder="User Ethereum Address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        className="p-4 rounded-xl bg-white/10 text-white placeholder-white/70 border border-violet-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
      />
      <input
        type="text"
        placeholder="IPFS Hash"
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
        className="p-4 rounded-xl bg-white/10 text-white placeholder-white/70 border border-violet-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition"
      />
      <button
        onClick={handleVerify}
        disabled={loading}
        className="py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-600 to-purple-700 hover:from-fuchsia-600 hover:to-violet-800 font-semibold shadow-[0_0_20px_rgba(155,59,255,0.5)] transition-all"
      >
        {loading ? "Verifying..." : "Verify KYC"}
      </button>
    </div>
  );
}
