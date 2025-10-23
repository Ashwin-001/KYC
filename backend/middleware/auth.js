const allowedKeys = (process.env.INSTITUTION_API_KEYS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function institutionAuth(req, res, next) {
  const apikey = req.header("x-api-key") || req.query.api_key;
  if (!apikey) return res.status(401).json({ error: "Missing API key" });
  if (!allowedKeys.includes(apikey))
    return res.status(403).json({ error: "Invalid API key" });
  req.verifier = { apiKey: apikey };
  next();
}

module.exports = { institutionAuth };
