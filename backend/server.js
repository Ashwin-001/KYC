require("dotenv").config();
const express = require("express");
const cors = require("cors");
const kycRoutes = require("./routes/kyc");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/kyc", kycRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`KYC backend running on port ${PORT}`);
});
