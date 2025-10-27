// deploy.js (CommonJS)
const hre = require("hardhat");

async function main() {
  const KycRegistry = await hre.ethers.getContractFactory("KycRegistry");
  const kyc = await KycRegistry.deploy();
  await kyc.waitForDeployment(); // ethers v6
  console.log("KycRegistry deployed to:", kyc.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
