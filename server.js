
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT;
if (!PORT) {
  console.error('❌ PORT is undefined at runtime on Render.');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const contactRoutes = require("./routes/contacts");
app.use("/api/contacts", contactRoutes);
const rawUri = process.env.MONGO_URI;
const uri = typeof rawUri === 'string' ? rawUri.trim() : '';

if (!uri) {
  console.error('❌ MONGO_URI is undefined/empty at runtime on Render.');
  process.exit(1);
}
if (!uri.startsWith('mongodb')) {
  console.error('❌ MONGO_URI does not start with "mongodb":', JSON.stringify(uri.slice(0, 20)));
  process.exit(1);
}

console.log('✅ MONGO_URI length:', uri.length);
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 15000,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
