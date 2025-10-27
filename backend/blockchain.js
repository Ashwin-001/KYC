require("dotenv").config();
const { ethers } = require("ethers");

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Minimal ABI
const ABI = [
  "function setKycStatus(address user, bool verified, string ipfsHash) public",
  "function getKycStatus(address user) public view returns (bool, string, uint256)"
];

if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.warn("WARNING: PRIVATE_KEY or CONTRACT_ADDRESS missing in .env");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

// Send KYC status tx on Sepolia
async function setKycStatusOnChain(address, verified, ipfsHash) {
  if (!wallet || !contract) throw new Error("Wallet or contract not configured");
  const tx = await contract.setKycStatus(address, verified, ipfsHash);
  const receipt = await tx.wait(); // wait for confirmation
  return receipt;
}

// Read KYC status from Sepolia
async function getKycStatus(address) {
  if (!contract) throw new Error("Contract not configured");
  const result = await contract.getKycStatus(address);
  const verified = result[0];
  const ipfsHash = result[1];
  const timestamp = typeof result[2] === "bigint" ? Number(result[2]) : result[2];
  return { verified, ipfsHash, timestamp };
}

module.exports = { setKycStatusOnChain, getKycStatus };
