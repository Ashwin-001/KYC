// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KycRegistry {
struct KycRecord { bool verified; string ipfsHash; uint256 timestamp; }
mapping(address => KycRecord) private records;
event KycUpdated(address indexed user, address indexed verifier, bool verified, string ipfsHash, uint256 timestamp);
function setKycStatus(address user, bool verified, string memory ipfsHash) public {
records[user] = KycRecord({ verified: verified, ipfsHash: ipfsHash, timestamp: block.timestamp });
emit KycUpdated(user, msg.sender, verified, ipfsHash, block.timestamp);
}
function getKycStatus(address user) public view returns (bool, string memory, uint256) {
KycRecord memory r = records[user];
return (r.verified, r.ipfsHash, r.timestamp);
}
}