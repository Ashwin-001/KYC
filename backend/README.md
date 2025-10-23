Title
KYC Backend (Hardhat Local)

Overview
A Node.js/Express backend that:

Accepts KYC submissions with a document upload.

Verifies users by writing status to an on-chain KycRegistry contract.

Exposes status via a REST API.
Designed to run against a local Hardhat node for demos and reviews.

Prerequisites

Node.js 18–22 installed

Git installed

A running local Hardhat node

A deployed KycRegistry contract on localhost

Project structure

server.js — Express app entry

routes/kyc.js — Register, verify, and status endpoints

blockchain.js — Contract calls (ethers v6)

ipfs.js — IPFS upload helper (stubbed CID for demo)

db.js — Placeholder for persistence (optional)

middleware/ — Optional middlewares

package.json — Scripts and dependencies

.env.example — Environment template (no secrets)

Quick start

Clone or open the backend folder

cd C:\KYC_DEMO\backend

Install dependencies

npm install

Configure environment

Copy the template and fill values:

cp .env.example .env

Open .env and set:

RPC_URL=http://127.0.0.1:8545

PRIVATE_KEY=<one private key from your running Hardhat node>

CONTRACT_ADDRESS=<your deployed contract address, e.g., 0x5FbD...aa3>

Start services

Start Hardhat node in a separate terminal:

npx hardhat node

Deploy the contract from your chain project if not deployed:

npx hardhat run .\scripts\deploy.js --network localhost

Start the backend:

npm run dev

You should see the server listening (default: http://localhost:4000)

API

Register KYC

POST /api/kyc/register

Content-Type: multipart/form-data

Fields:

name: string

ethAddress: string (0x-prefixed address)

document: file (any small txt/pdf/png for demo)

Response (201):

{ "userId": "...", "ipfsHash": "..." }

Notes:

Document is uploaded with formidable; ensure the form key is document and type is File.

IPFS is stubbed to return a demo CID; replace ipfs.js for real uploads.

Verify KYC

POST /api/kyc/verify

Headers:

x-api-key: psg_api_1234

Body (JSON):

{ "userId": "<from register>", "verified": true }

Response (200):

{ "success": true, "txHash": "0x..." }

Writes on-chain using PRIVATE_KEY against CONTRACT_ADDRESS.

Get KYC status

GET /api/kyc/status/:address

Response (200):

{ "verified": boolean, "ipfsHash": string, "timestamp": number }

Troubleshooting

500 on register

Check backend logs. Common:

Wrong formidable usage: ensure kyc.js uses new IncomingForm(...) with { IncomingForm } import.

Missing file: ensure form key is document and type is File.

IPFS helper: ipfs.js should export uploadToIPFS(filePath).

401 on verify

Ensure header x-api-key=psg_api_1234 is set.

“Wallet or contract not configured”

Verify .env has PRIVATE_KEY and CONTRACT_ADDRESS (from your deployment).

Restart backend after editing .env.

“connection refused” or hanging

Confirm Hardhat node is running on RPC_URL.

Re-deploy if address mismatch.

Security and secrets

Do not commit .env. Use .env.example for placeholders.

Rotate any leaked PRIVATE_KEY immediately.

Consider enabling secret scanning in your Git host.

Development scripts

Start dev server (with nodemon): npm run dev

Lint/format (if configured): npm run lint / npm run format

Tests (if added): npm test

Deployment notes

This project targets local development.

For testnet/mainnet:

Replace RPC_URL with the network RPC.

Use a funded deployer key (never commit).

Add CORS/HTTPS, production logging, and rate-limiting.

License

MIT (or your chosen license)

Contributing

Fork, create a feature branch, open a pull request.

Git commands (safe push)

Ensure .gitignore includes:

.env

node_modules/

logs/, *.log

dist/, coverage/, uploads/

Initialize and commit:

git init

git add .

git status (confirm .env and node_modules are ignored)

git commit -m "feat: KYC backend working (register/verify/status)"

Set branch and push:

git branch -M main

git remote add origin https://github.com/<your-username>/<your-repo>.git

git push -u origin main