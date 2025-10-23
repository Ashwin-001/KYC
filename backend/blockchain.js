// backend/blockchain.js
require("dotenv").config();
const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Minimal ABI for KycRegistry
const ABI = [
  "function setKycStatus(address user, bool verified, string ipfsHash) public",
  "function getKycStatus(address user) public view returns (bool, string, uint256)"
];

if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.warn("WARNING: PRIVATE_KEY or CONTRACT_ADDRESS missing in .env");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;
const contract = CONTRACT_ADDRESS ? new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet || provider) : null;

async function setKycStatusOnChain(address, verified, ipfsHash) {
  if (!wallet || !contract) {
    throw new Error("Wallet or contract not configured. Check .env values.");
  }
  const tx = await contract.setKycStatus(address, verified, ipfsHash);
  // ethers v6 returns a TransactionResponse with wait()
  const receipt = await tx.wait();
  return receipt;
}

async function getKycStatus(address) {
  if (!contract) {
    throw new Error("Contract not configured. Check .env values.");
  }
  const result = await contract.getKycStatus(address);
  // Normalize v6 result tuple
  const verified = result[0];
  const ipfsHash = result[1];
  const timestamp = typeof result[2] === "bigint" ? Number(result[2]) : result[2];
  return { verified, ipfsHash, timestamp };
}

module.exports = { setKycStatusOnChain, getKycStatus };
