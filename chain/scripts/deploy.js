const hre = require("hardhat");

async function main() {
console.log("Deploy JS start");
const KycRegistry = await hre.ethers.getContractFactory("KycRegistry");
const c = await KycRegistry.deploy();
await c.deployed?.();
const addr = c.address || (await c.getAddress?.());
console.log("Deployed at:", addr);
}
main().then(() => console.log("Deploy JS done")).catch(e => { console.error("Deploy error:", e); process.exit(1); });