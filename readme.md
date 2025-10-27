#  KYC — Ethereum (Sepolia Testnet)

##  Overview

This decentralized application (DApp) demonstrates a **KYC (Know Your Customer)** verification system built on the **Ethereum Sepolia Test Network**.  
It allows users to **register**, **verify**, and **check** their KYC status using **smart contracts**, **MetaMask**, and **IPFS** for secure and decentralized data storage.


##  Tech Stack

| Layer                  | Technology                        |
| ---------------------- | --------------------------------- |
| **Smart Contract**     | Solidity (v0.8.20)                |
| **Frontend**           | React.js + Tailwind CSS           |
| **Blockchain Network** | Ethereum Sepolia Testnet          |
| **Storage**            | IPFS (InterPlanetary File System) |
| **Wallet Integration** | MetaMask                          |

---

## Features

###  1. User Registration

- Users submit their identity details and upload KYC documents.
- Files are uploaded to **IPFS**, generating a unique **hash (CID)**.
- The **Ethereum address** and **IPFS hash** are recorded locally.

**Output:** IPFS hash (used for verification)


###  2. KYC Verification (Admin)

- The verifier (admin) inputs the **Ethereum address** and **IPFS hash**.
- Smart contract function `setKycStatus()` is called via MetaMask.
- The record is stored on the **Ethereum Sepolia blockchain**, containing:
  - `verified` (true/false)
  - `ipfsHash`
  - `timestamp`

**Output:** On-chain transaction confirming verification.


###  3. Check KYC Status

- Any user can check their verification status by entering their Ethereum address.
- Displays:
  - Verification status 
  - IPFS hash (clickable link)
  - Verification timestamp

**Output:** Real-time verification status from blockchain.

##  Setup Guide

###  Clone Repository

```bash
git clone https://github.com/Ashwin-001/KYC.git
cd KYC
```

###  Install Dependencies

```bash
npm install
```

###  Compile & Deploy Smart Contract

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

###  Run Frontend and Backend

```bash
npm start
npm run dev
```

### 🦊 MetaMask Setup

- Install MetaMask

- Connect to the Sepolia Test Network

- Get Sepolia ETH from the official faucet

- Approve MetaMask popups for all verification transactions

### Screenshots 


##  Credits

Developed by Ashwin Kumar R S, [Bala Subramanian S](https://github.com/bala227)


