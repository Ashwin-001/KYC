const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");
const path = require("path");

const file = path.join(__dirname, "db.json");
const adapter = new JSONFile(file);
const defaultData = { users: [] };
const db = new Low(adapter, defaultData);

async function initDB() {
  await db.read();
  if (!db.data) db.data = defaultData;
}

async function addUser(user) {
  await initDB();
  db.data.users.push(user);
  await db.write();
  return user;
}

async function getUserById(id) {
  await initDB();
  return db.data.users.find((u) => u.id === id);
}

async function updateUser(id, patch) {
  await initDB();
  const idx = db.data.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  db.data.users[idx] = { ...db.data.users[idx], ...patch };
  await db.write();
  return db.data.users[idx];
}

async function getUserByAddress(addr) {
  await initDB();
  return db.data.users.find(
    (u) => u.ethAddress && u.ethAddress.toLowerCase() === String(addr).toLowerCase()
  );
}

module.exports = { addUser, getUserById, updateUser, getUserByAddress };
