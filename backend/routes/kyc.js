const express = require("express");
const { IncomingForm } = require("formidable");
const path = require("path");
const fs = require("fs");
const { uploadToIPFS } = require("../ipfs");           // ensure this exports uploadToIPFS(filePath): Promise<string>
const { setKycStatusOnChain } = require("../blockchain"); // ensure this exports setKycStatusOnChain(address, verified, ipfsHash)

const router = express.Router();

// POST /api/kyc/register
// form-data: name (text), ethAddress (text), document (file)
router.post("/register", (req, res) => {
  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20 MB
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(400).json({ error: "Invalid form data" });
      }

      const name = String(fields.name || "").trim();
      const ethAddress = String(fields.ethAddress || "").trim();
      const doc = files.document;

      if (!name || !ethAddress || !doc) {
        return res.status(400).json({ error: "Missing name, ethAddress, or document" });
      }

      // In formidable v3, files.document is an object with filepath
      const filePath = Array.isArray(doc) ? doc[0].filepath : doc.filepath;
      if (!filePath || !fs.existsSync(filePath)) {
        return res.status(400).json({ error: "Uploaded file is missing" });
      }

      // Upload file to IPFS and get a hash (CID)
      const ipfsHash = await uploadToIPFS(filePath);

      // Persist user record in your DB layer (simple in-memory or actual DB)
      // Example minimal in-memory storage (replace with your real db.js calls):
      // const userId = await db.createUser({ name, ethAddress, ipfsHash });
      // For demo, generate a simple ID:
      const userId = `${ethAddress}:${Date.now()}`;

      return res.status(201).json({
        userId,
        name,
        ethAddress,
        ipfsHash,
      });
    } catch (e) {
      console.error("Register handler error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

// POST /api/kyc/verify
// headers: x-api-key: psg_api_1234
// body: { "userId": "...", "verified": true }
router.post("/verify", express.json(), async (req, res) => {
  try {
    const apiKey = req.header("x-api-key");
    if (apiKey !== "psg_api_1234") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { userId, verified } = req.body || {};
    if (!userId || typeof verified !== "boolean") {
      return res.status(400).json({ error: "Missing userId or verified" });
    }

    // Resolve user data from DB using userId (must contain ethAddress and ipfsHash)
    // For demo: parse userId back (ethAddress and fake ipfsHash stored client-side would be better)
    const [ethAddress] = String(userId).split(":");
    if (!ethAddress) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // In a real app, fetch ipfsHash from your DB by userId
    // For demo, accept an optional ipfsHash in body (or leave empty)
    const ipfsHash = req.body.ipfsHash || "demo-ipfs-hash";

    // Call the contract via your blockchain helper
    const tx = await setKycStatusOnChain(ethAddress, verified, ipfsHash);

    return res.status(200).json({
      success: true,
      txHash: tx?.hash || tx?.transactionHash || "0x-demo",
    });
  } catch (e) {
    console.error("Verify handler error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/status/:address", async (req, res) => {
  try {
    let address = req.params.address;
    if (!address) return res.status(400).json({ error: "Missing address" });

    // If someone sends userId with timestamp, strip it
    if (address.includes(":")) {
      address = address.split(":")[0];
    }

    const { ethers } = require("ethers");
    if (!ethers.isAddress(address)) return res.status(400).json({ error: "Invalid Ethereum address" });

    const { getKycStatus } = require("../blockchain");
    const status = await getKycStatus(address);

    return res.status(200).json(status);
  } catch (e) {
    console.error("Status handler error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
