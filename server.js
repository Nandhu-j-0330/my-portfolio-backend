require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const contactRoutes = require("./routes/contacts");
app.use("/api/contacts", contactRoutes);

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/myportfolio")

.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
